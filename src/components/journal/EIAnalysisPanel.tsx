import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { cs } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Minus, Lightbulb, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';
import { analyzeEI, projectNutrients, EI_TARGETS } from '@/lib/estimativeIndex';
import type { Aquarium, Fertilizer, JournalEntry } from '@/lib/storage';

interface EIAnalysisPanelProps {
  aquarium: Aquarium;
  fertilizers: Fertilizer[];
  journalEntries: JournalEntry[];
}

export const EIAnalysisPanel = ({
  aquarium,
  fertilizers,
  journalEntries,
}: EIAnalysisPanelProps) => {
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
      })),
      weeklyDosing
    );
  }, [aquarium.volume, fertilizers, weeklyDosing]);

  const projection = useMemo(() => {
    return projectNutrients(
      analysis.currentLevels,
      {
        nitrogen: analysis.weeklyTotals.nitrogen / 7,
        phosphorus: analysis.weeklyTotals.phosphorus / 7,
        potassium: analysis.weeklyTotals.potassium / 7,
        iron: analysis.weeklyTotals.iron / 7,
      }
    );
  }, [analysis]);

  const getStatusIcon = (status: 'low' | 'optimal' | 'high') => {
    switch (status) {
      case 'low': return <TrendingDown className="h-4 w-4 text-muted-foreground" />;
      case 'optimal': return <Minus className="h-4 w-4 text-primary" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: 'low' | 'optimal' | 'high') => {
    switch (status) {
      case 'low': return 'bg-muted text-muted-foreground';
      case 'optimal': return 'bg-primary/20 text-primary';
      case 'high': return 'bg-destructive/20 text-destructive';
    }
  };

  const getProgressValue = (value: number, min: number, max: number) => {
    if (value < min) return (value / min) * 33;
    if (value > max) return 100;
    return 33 + ((value - min) / (max - min)) * 34 + 33;
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-bold">Estimative Index</h3>
        </div>

        {/* Current Levels */}
        <Card className="p-4 space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
            Týdenní přísun živin
          </h4>
          
          <div className="space-y-3">
            {/* Nitrogen */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {getStatusIcon(analysis.status.nitrogen)}
                  Dusík (NO₃)
                </span>
                <Badge className={getStatusColor(analysis.status.nitrogen)}>
                  {analysis.weeklyTotals.nitrogen.toFixed(1)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyTotals.nitrogen, EI_TARGETS.nitrateMin, EI_TARGETS.nitrateMax)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{EI_TARGETS.nitrateMin}</span>
                <span>Cíl: {EI_TARGETS.nitrateMin}-{EI_TARGETS.nitrateMax} ppm</span>
                <span>{EI_TARGETS.nitrateMax}</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {getStatusIcon(analysis.status.phosphorus)}
                  Fosfor (PO₄)
                </span>
                <Badge className={getStatusColor(analysis.status.phosphorus)}>
                  {analysis.weeklyTotals.phosphorus.toFixed(2)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyTotals.phosphorus, EI_TARGETS.phosphateMin, EI_TARGETS.phosphateMax)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{EI_TARGETS.phosphateMin}</span>
                <span>Cíl: {EI_TARGETS.phosphateMin}-{EI_TARGETS.phosphateMax} ppm</span>
                <span>{EI_TARGETS.phosphateMax}</span>
              </div>
            </div>

            {/* Potassium */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {getStatusIcon(analysis.status.potassium)}
                  Draslík (K)
                </span>
                <Badge className={getStatusColor(analysis.status.potassium)}>
                  {analysis.weeklyTotals.potassium.toFixed(1)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyTotals.potassium, EI_TARGETS.potassiumMin, EI_TARGETS.potassiumMax)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{EI_TARGETS.potassiumMin}</span>
                <span>Cíl: {EI_TARGETS.potassiumMin}-{EI_TARGETS.potassiumMax} ppm</span>
                <span>{EI_TARGETS.potassiumMax}</span>
              </div>
            </div>

            {/* Iron */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {getStatusIcon(analysis.status.iron)}
                  Železo (Fe)
                </span>
                <Badge className={getStatusColor(analysis.status.iron)}>
                  {analysis.weeklyTotals.iron.toFixed(2)} ppm
                </Badge>
              </div>
              <Progress 
                value={getProgressValue(analysis.weeklyTotals.iron, EI_TARGETS.ironMin, EI_TARGETS.ironMax)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{EI_TARGETS.ironMin}</span>
                <span>Cíl: {EI_TARGETS.ironMin}-{EI_TARGETS.ironMax} ppm</span>
                <span>{EI_TARGETS.ironMax}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Projection Chart */}
        {projection.length > 0 && (
          <Card className="p-4 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              7denní projekce
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
                      border: '1px solid hsl(var(--border))',
                      fontSize: '12px'
                    }} 
                  />
                  <ReferenceLine y={EI_TARGETS.nitrateMin} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
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
          <Card className="p-4 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              Doporučení
            </h4>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-primary/5 rounded border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{rec.fertilizerName}</span>
                    <Badge variant="secondary">
                      {rec.recommendedDose} {rec.unit}/den
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{rec.reasoning}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tips */}
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              Tipy
            </h4>
          </div>
          <div className="space-y-2">
            {analysis.tips.map((tip, idx) => (
              <p key={idx} className="text-sm">{tip}</p>
            ))}
          </div>
        </Card>

        {/* Future AI placeholder */}
        <Card className="p-4 border-dashed space-y-2 opacity-60">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <h4 className="font-bold text-sm">AI Asistent</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            Brzy: Personalizované rady pomocí AI na základě vašich dat a fottek.
          </p>
        </Card>
      </div>
    </ScrollArea>
  );
};
