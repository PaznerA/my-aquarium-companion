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
  EITargets,
  calculateConsumptionMultiplier,
  type NutrientStatus,
  type DayProjection 
} from '@/lib/estimativeIndex';
import type { Aquarium, Fertilizer, JournalEntry, DosingLog } from '@/lib/storage';
import { useI18n } from '@/lib/i18n';

interface EIAnalysisPanelProps {
  aquarium: Aquarium;
  fertilizers: Fertilizer[];
  journalEntries: JournalEntry[];
  dosingLogs: DosingLog[];
}

export const EIAnalysisPanel = ({
  aquarium,
  fertilizers,
  journalEntries,
  dosingLogs,
}: EIAnalysisPanelProps) => {
  const { t, language } = useI18n();

  // Build dosing logs from journal entries + dedicated logs
  const allDosingLogs = useMemo(() => {
    const logsFromEntries: DosingLog[] = journalEntries
      .filter(e => e.aquariumId === aquarium.id)
      .flatMap(entry => 
        entry.dosingEntries.map(dose => ({
          id: `${entry.id}-${dose.fertilizerId}`,
          fertilizerId: dose.fertilizerId,
          aquariumId: aquarium.id,
          amount: dose.amount,
          date: entry.date,
          userId: entry.userId,
        }))
      );
    
    const relevantDosingLogs = dosingLogs.filter(log => log.aquariumId === aquarium.id);
    
    return [...logsFromEntries, ...relevantDosingLogs];
  }, [journalEntries, dosingLogs, aquarium.id]);

  const analysis = useMemo(() => {
    return analyzeEI(allDosingLogs, fertilizers, aquarium, language);
  }, [allDosingLogs, fertilizers, aquarium, language]);

  const consumptionMultiplier = useMemo(() => {
    return calculateConsumptionMultiplier(aquarium);
  }, [aquarium]);

  const projection = useMemo((): DayProjection[] => {
    const currentLevels = {
      nitrogen: analysis.weeklyNutrients.nitrogen / 7,
      phosphorus: analysis.weeklyNutrients.phosphorus / 7,
      potassium: analysis.weeklyNutrients.potassium / 7,
      iron: analysis.weeklyNutrients.iron / 7,
      magnesium: analysis.weeklyNutrients.magnesium / 7,
    };
    
    return projectNutrients(currentLevels, [], aquarium);
  }, [analysis, aquarium]);

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

  const adjustedTargets = {
    nitrogenMin: EITargets.nitrogenMin * consumptionMultiplier,
    nitrogenMax: EITargets.nitrogenMax * consumptionMultiplier,
    phosphorusMin: EITargets.phosphorusMin * consumptionMultiplier,
    phosphorusMax: EITargets.phosphorusMax * consumptionMultiplier,
    potassiumMin: EITargets.potassiumMin * consumptionMultiplier,
    potassiumMax: EITargets.potassiumMax * consumptionMultiplier,
    ironMin: EITargets.ironMin * consumptionMultiplier,
    ironMax: EITargets.ironMax * consumptionMultiplier,
    magnesiumMin: EITargets.magnesiumMin * consumptionMultiplier,
    magnesiumMax: EITargets.magnesiumMax * consumptionMultiplier,
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
                  {analysis.weeklyNutrients.nitrogen.toFixed(1)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyNutrients.nitrogen, adjustedTargets.nitrogenMin, adjustedTargets.nitrogenMax)} 
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
                  {analysis.weeklyNutrients.phosphorus.toFixed(2)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyNutrients.phosphorus, adjustedTargets.phosphorusMin, adjustedTargets.phosphorusMax)} 
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
                  {analysis.weeklyNutrients.potassium.toFixed(1)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyNutrients.potassium, adjustedTargets.potassiumMin, adjustedTargets.potassiumMax)} 
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
                  {analysis.weeklyNutrients.iron.toFixed(2)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyNutrients.iron, adjustedTargets.ironMin, adjustedTargets.ironMax)} 
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
                  {analysis.weeklyNutrients.magnesium.toFixed(1)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyNutrients.magnesium, adjustedTargets.magnesiumMin, adjustedTargets.magnesiumMax)} 
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
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickFormatter={(v) => `D${v}`}
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
                  <Line type="monotone" dataKey="magnesium" name="Mg" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
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
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tips */}
        {analysis.tips.length > 0 && (
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
        )}

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
