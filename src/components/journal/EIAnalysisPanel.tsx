import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { cs } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Minus, Lightbulb, Sparkles, Leaf, Sun, Droplets } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';
import { 
  analyzeEI, 
  projectNutrients, 
  EI_TARGETS,
  calculateConsumptionMultiplier,
  type NutrientStatus,
} from '@/lib/estimativeIndex';
import type { Aquarium, Fertilizer, JournalEntry, WaterSource } from '@/types';
import { useI18n } from '@/lib/i18n';

interface EIAnalysisPanelProps {
  aquarium: Aquarium;
  fertilizers: Fertilizer[];
  journalEntries: JournalEntry[];
  waterSource?: WaterSource | null;
}

export const EIAnalysisPanel = ({
  aquarium,
  fertilizers,
  journalEntries,
  waterSource,
}: EIAnalysisPanelProps) => {
  const { t, language } = useI18n();

  // Get last 7 days of dosing data
  const weeklyDosing = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => 
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    );
    
    const relevantEntries = journalEntries.filter(
      e => e.aquariumId === aquarium.id && last7Days.includes(e.date)
    );
    
    // Sum up dosing per fertilizer
    const dosingMap = new Map<string, number>();
    
    relevantEntries.forEach(entry => {
      entry.dosingEntries.forEach(dose => {
        const current = dosingMap.get(dose.fertilizerId) || 0;
        dosingMap.set(dose.fertilizerId, current + dose.amount);
      });
    });
    
    return Array.from(dosingMap.entries()).map(([fertilizerId, totalAmount]) => ({
      fertilizerId,
      totalAmount,
    }));
  }, [journalEntries, aquarium.id]);

  const analysis = useMemo(() => {
    return analyzeEI(
      aquarium.volume,
      fertilizers.map(f => ({
        id: f.id,
        name: f.name,
        unit: f.unit,
        nitrogenPpm: f.nitrogenPpm,
        phosphorusPpm: f.phosphorusPpm,
        potassiumPpm: f.potassiumPpm,
        ironPpm: f.ironPpm,
        magnesiumPpm: f.magnesiumPpm,
      })),
      weeklyDosing,
      aquarium,
      language,
      waterSource
    );
  }, [aquarium, fertilizers, weeklyDosing, language, waterSource]);

  const consumptionMultiplier = useMemo(() => {
    return calculateConsumptionMultiplier(aquarium);
  }, [aquarium]);

  const projection = useMemo(() => {
    return projectNutrients(
      analysis.currentLevels,
      {
        nitrogen: analysis.weeklyTotals.nitrogen / 7,
        phosphorus: analysis.weeklyTotals.phosphorus / 7,
        potassium: analysis.weeklyTotals.potassium / 7,
        iron: analysis.weeklyTotals.iron / 7,
        magnesium: analysis.weeklyTotals.magnesium / 7,
      },
      aquarium,
      7,
      50,
      waterSource
    );
  }, [analysis, aquarium, waterSource]);

  const getStatusIcon = (status: NutrientStatus) => {
    switch (status) {
      case 'low': return <TrendingDown className="h-4 w-4 text-amber-500" />;
      case 'optimal': return <Minus className="h-4 w-4 text-emerald-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: NutrientStatus) => {
    switch (status) {
      case 'low': return 'bg-amber-500/20 text-amber-700 dark:text-amber-400';
      case 'optimal': return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400';
      case 'high': return 'bg-red-500/20 text-red-700 dark:text-red-400';
    }
  };

  const getProgressValue = (value: number, min: number, max: number) => {
    if (value < min) return (value / min) * 33;
    if (value > max) return 100;
    return 33 + ((value - min) / (max - min)) * 34 + 33;
  };

  const getDensityLabel = () => {
    switch (aquarium.plantDensity) {
      case 'low': return t.inventory.plantDensityLow;
      case 'medium': return t.inventory.plantDensityMedium;
      case 'high': return t.inventory.plantDensityHigh;
      case 'dutch': return t.inventory.plantDensityDutch;
      default: return t.inventory.plantDensityMedium;
    }
  };

  const getLightLabel = () => {
    switch (aquarium.lightLevel) {
      case 'low': return t.inventory.lightLevelLow;
      case 'medium': return t.inventory.lightLevelMedium;
      case 'high': return t.inventory.lightLevelHigh;
      default: return t.inventory.lightLevelMedium;
    }
  };

  // Adjusted targets based on consumption multiplier
  const adjustedTargets = {
    nitrogenMin: EI_TARGETS.nitrogenMin * consumptionMultiplier,
    nitrogenMax: EI_TARGETS.nitrogenMax * consumptionMultiplier,
    phosphorusMin: EI_TARGETS.phosphorusMin * consumptionMultiplier,
    phosphorusMax: EI_TARGETS.phosphorusMax * consumptionMultiplier,
    potassiumMin: EI_TARGETS.potassiumMin * consumptionMultiplier,
    potassiumMax: EI_TARGETS.potassiumMax * consumptionMultiplier,
    ironMin: EI_TARGETS.ironMin * consumptionMultiplier,
    ironMax: EI_TARGETS.ironMax * consumptionMultiplier,
    magnesiumMin: EI_TARGETS.magnesiumMin * consumptionMultiplier,
    magnesiumMax: EI_TARGETS.magnesiumMax * consumptionMultiplier,
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-bold">Estimative Index</h3>
        </div>

        {/* Aquarium Setup Info */}
        <Card className="p-4 border-2 space-y-3">
          <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
            {t.inventory.consumptionMultiplier}
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              {getDensityLabel()}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Sun className="h-3 w-3" />
              {getLightLabel()}
            </Badge>
            {aquarium.hasCO2 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                CO₂
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={consumptionMultiplier >= 3 ? 'bg-red-500/20 text-red-700' : consumptionMultiplier >= 1.5 ? 'bg-amber-500/20 text-amber-700' : 'bg-emerald-500/20 text-emerald-700'}>
              {consumptionMultiplier.toFixed(1)}×
            </Badge>
            <span className="text-sm text-muted-foreground">
              {analysis.consumptionDescription}
            </span>
          </div>
        </Card>

        {/* Water Source Contribution */}
        {waterSource && (analysis.waterSourceContribution.nitrogen > 0 || 
          analysis.waterSourceContribution.potassium > 0 || 
          analysis.waterSourceContribution.magnesium > 0) && (
          <Card className="p-4 border-2 space-y-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              {language === 'cs' ? 'Příspěvek vstupní vody' : 'Water Source Contribution'}
            </h4>
            <p className="text-xs text-muted-foreground">
              {language === 'cs' 
                ? `Zdroj: ${waterSource.name} (při 50% výměně vody)`
                : `Source: ${waterSource.name} (at 50% water change)`}
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {analysis.waterSourceContribution.nitrogen > 0 && (
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-bold">{analysis.waterSourceContribution.nitrogen.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">NO₃ ppm</div>
                </div>
              )}
              {analysis.waterSourceContribution.potassium > 0 && (
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-bold">{analysis.waterSourceContribution.potassium.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">K ppm</div>
                </div>
              )}
              {analysis.waterSourceContribution.magnesium > 0 && (
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-bold">{analysis.waterSourceContribution.magnesium.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Mg ppm</div>
                </div>
              )}
              {analysis.waterSourceContribution.iron > 0 && (
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="font-bold">{analysis.waterSourceContribution.iron.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Fe ppm</div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Current Levels */}
        <Card className="p-4 border-2 space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
            {language === 'cs' ? 'Týdenní přísun živin' : 'Weekly Nutrient Supply'}
          </h4>
          
          <div className="space-y-3">
            {/* Nitrogen */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {getStatusIcon(analysis.status.nitrogen)}
                  {language === 'cs' ? 'Dusík (N)' : 'Nitrogen (N)'}
                </span>
                <Badge className={getStatusColor(analysis.status.nitrogen)}>
                  {analysis.weeklyTotals.nitrogen.toFixed(1)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyTotals.nitrogen, adjustedTargets.nitrogenMin, adjustedTargets.nitrogenMax)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{adjustedTargets.nitrogenMin.toFixed(0)}</span>
                <span>{language === 'cs' ? 'Cíl' : 'Target'}: {adjustedTargets.nitrogenMin.toFixed(0)}-{adjustedTargets.nitrogenMax.toFixed(0)} ppm</span>
                <span>{adjustedTargets.nitrogenMax.toFixed(0)}</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {getStatusIcon(analysis.status.phosphorus)}
                  {language === 'cs' ? 'Fosfor (P)' : 'Phosphorus (P)'}
                </span>
                <Badge className={getStatusColor(analysis.status.phosphorus)}>
                  {analysis.weeklyTotals.phosphorus.toFixed(2)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyTotals.phosphorus, adjustedTargets.phosphorusMin, adjustedTargets.phosphorusMax)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{adjustedTargets.phosphorusMin.toFixed(1)}</span>
                <span>{language === 'cs' ? 'Cíl' : 'Target'}: {adjustedTargets.phosphorusMin.toFixed(1)}-{adjustedTargets.phosphorusMax.toFixed(1)} ppm</span>
                <span>{adjustedTargets.phosphorusMax.toFixed(1)}</span>
              </div>
            </div>

            {/* Potassium */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {getStatusIcon(analysis.status.potassium)}
                  {language === 'cs' ? 'Draslík (K)' : 'Potassium (K)'}
                </span>
                <Badge className={getStatusColor(analysis.status.potassium)}>
                  {analysis.weeklyTotals.potassium.toFixed(1)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyTotals.potassium, adjustedTargets.potassiumMin, adjustedTargets.potassiumMax)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{adjustedTargets.potassiumMin.toFixed(0)}</span>
                <span>{language === 'cs' ? 'Cíl' : 'Target'}: {adjustedTargets.potassiumMin.toFixed(0)}-{adjustedTargets.potassiumMax.toFixed(0)} ppm</span>
                <span>{adjustedTargets.potassiumMax.toFixed(0)}</span>
              </div>
            </div>

            {/* Iron */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {getStatusIcon(analysis.status.iron)}
                  {language === 'cs' ? 'Železo (Fe)' : 'Iron (Fe)'}
                </span>
                <Badge className={getStatusColor(analysis.status.iron)}>
                  {analysis.weeklyTotals.iron.toFixed(2)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyTotals.iron, adjustedTargets.ironMin, adjustedTargets.ironMax)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{adjustedTargets.ironMin.toFixed(2)}</span>
                <span>{language === 'cs' ? 'Cíl' : 'Target'}: {adjustedTargets.ironMin.toFixed(2)}-{adjustedTargets.ironMax.toFixed(2)} ppm</span>
                <span>{adjustedTargets.ironMax.toFixed(2)}</span>
              </div>
            </div>

            {/* Magnesium */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {getStatusIcon(analysis.status.magnesium)}
                  {language === 'cs' ? 'Hořčík (Mg)' : 'Magnesium (Mg)'}
                </span>
                <Badge className={getStatusColor(analysis.status.magnesium)}>
                  {analysis.weeklyTotals.magnesium.toFixed(1)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyTotals.magnesium, adjustedTargets.magnesiumMin, adjustedTargets.magnesiumMax)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{adjustedTargets.magnesiumMin.toFixed(0)}</span>
                <span>{language === 'cs' ? 'Cíl' : 'Target'}: {adjustedTargets.magnesiumMin.toFixed(0)}-{adjustedTargets.magnesiumMax.toFixed(0)} ppm</span>
                <span>{adjustedTargets.magnesiumMax.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Projection Chart */}
        {projection.length > 0 && (
          <Card className="p-4 border-2 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              {language === 'cs' ? '7denní projekce' : '7-Day Projection'}
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickFormatter={(v) => format(new Date(v), 'd.M.', { locale: cs })}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '2px solid hsl(var(--border))',
                      fontSize: '12px'
                    }} 
                  />
                  <ReferenceLine y={adjustedTargets.nitrogenMin} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="nitrogen" name="N" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="potassium" name="K" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <Card className="p-4 border-2 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              {language === 'cs' ? 'Doporučení' : 'Recommendations'}
            </h4>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-primary/5 rounded border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{rec.fertilizerName}</span>
                    <Badge variant="secondary">
                      {rec.recommendedDose} {rec.unit}/{language === 'cs' ? 'den' : 'day'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{rec.reasoning}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tips */}
        <Card className="p-4 border-2 space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              {language === 'cs' ? 'Tipy' : 'Tips'}
            </h4>
          </div>
          <div className="space-y-2">
            {analysis.tips.map((tip, idx) => (
              <p key={idx} className="text-sm">{tip}</p>
            ))}
          </div>
        </Card>

        {/* Future AI placeholder */}
        <Card className="p-4 border-2 border-dashed space-y-2 opacity-60">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <h4 className="font-bold text-sm">AI {language === 'cs' ? 'Asistent' : 'Assistant'}</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            {language === 'cs' 
              ? 'Brzy: Personalizované rady pomocí AI na základě vašich dat a fottek.'
              : 'Coming soon: Personalized advice using AI based on your data and photos.'}
          </p>
        </Card>
      </div>
    </ScrollArea>
  );
};
