import { useState, useMemo } from 'react';
import { format, subDays, subMonths, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ReferenceLine, ReferenceArea,
  Scatter, ScatterChart, ComposedChart, Bar
} from 'recharts';
import { 
  Eye, EyeOff, ZoomIn, ZoomOut, Calendar, 
  Droplets, Scissors, Filter, Leaf, FlaskConical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { EI_TARGETS } from '@/lib/estimativeIndex';
import type { WaterParameter, JournalEntry, Fertilizer } from '@/lib/storage';

interface AquariumChartProps {
  aquariumId: string;
  aquariumVolume: number;
  waterParameters: WaterParameter[];
  journalEntries: JournalEntry[];
  fertilizers: Fertilizer[];
}

type ZoomRange = 'week' | 'month' | '3months' | 'custom';

interface ChartDataPoint {
  date: string;
  dateObj: Date;
  // Water params
  pH?: number;
  temperature?: number;
  ammonia?: number;
  nitrite?: number;
  nitrate?: number;
  kh?: number;
  gh?: number;
  // Journal data
  waterChangePercent?: number;
  hasWaterChange?: boolean;
  hasVacuumed?: boolean;
  hasTrimmed?: boolean;
  hasFilterCleaned?: boolean;
  notes?: string;
  // Dosing totals
  totalDosing?: number;
  dosingDetails?: { name: string; amount: number; unit: string }[];
}

interface VisibilityState {
  pH: boolean;
  temperature: boolean;
  nitrate: boolean;
  ammonia: boolean;
  nitrite: boolean;
  kh: boolean;
  gh: boolean;
  waterChange: boolean;
  dosing: boolean;
  maintenance: boolean;
}

const defaultVisibility: VisibilityState = {
  pH: true,
  temperature: true,
  nitrate: true,
  ammonia: false,
  nitrite: false,
  kh: false,
  gh: false,
  waterChange: true,
  dosing: true,
  maintenance: true,
};

export const AquariumChart = ({
  aquariumId,
  aquariumVolume,
  waterParameters,
  journalEntries,
  fertilizers,
}: AquariumChartProps) => {
  const [zoomRange, setZoomRange] = useState<ZoomRange>('month');
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date }>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  const [visibility, setVisibility] = useState<VisibilityState>(defaultVisibility);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate date range based on zoom
  const dateRange = useMemo(() => {
    const now = new Date();
    switch (zoomRange) {
      case 'week':
        return { from: subDays(now, 7), to: now };
      case 'month':
        return { from: subMonths(now, 1), to: now };
      case '3months':
        return { from: subMonths(now, 3), to: now };
      case 'custom':
        return customDateRange;
      default:
        return { from: subMonths(now, 1), to: now };
    }
  }, [zoomRange, customDateRange]);

  // Combine water parameters and journal entries into chart data
  const chartData = useMemo(() => {
    const dataMap = new Map<string, ChartDataPoint>();

    // Add water parameters
    waterParameters
      .filter(wp => wp.aquariumId === aquariumId)
      .forEach(wp => {
        const dateKey = wp.date;
        const existing = dataMap.get(dateKey) || { 
          date: dateKey, 
          dateObj: parseISO(dateKey) 
        };
        dataMap.set(dateKey, {
          ...existing,
          pH: wp.ph,
          temperature: wp.temperature,
          ammonia: wp.ammonia,
          nitrite: wp.nitrite,
          nitrate: wp.nitrate,
          kh: wp.kh,
          gh: wp.gh,
        });
      });

    // Add journal entries
    journalEntries
      .filter(je => je.aquariumId === aquariumId)
      .forEach(je => {
        const dateKey = je.date;
        const existing = dataMap.get(dateKey) || { 
          date: dateKey, 
          dateObj: parseISO(dateKey) 
        };

        // Calculate total dosing
        let totalDosing = 0;
        const dosingDetails: { name: string; amount: number; unit: string }[] = [];
        
        je.dosingEntries.forEach(de => {
          if (de.amount > 0) {
            const fert = fertilizers.find(f => f.id === de.fertilizerId);
            if (fert) {
              totalDosing += de.amount;
              dosingDetails.push({
                name: fert.name,
                amount: de.amount,
                unit: fert.unit,
              });
            }
          }
        });

        dataMap.set(dateKey, {
          ...existing,
          waterChangePercent: je.waterChanged ? je.waterChangePercent : undefined,
          hasWaterChange: je.waterChanged,
          hasVacuumed: je.vacuumed,
          hasTrimmed: je.trimmed,
          hasFilterCleaned: je.filterCleaned,
          notes: je.notes,
          totalDosing: totalDosing > 0 ? totalDosing : undefined,
          dosingDetails: dosingDetails.length > 0 ? dosingDetails : undefined,
        });
      });

    // Filter by date range and sort
    return Array.from(dataMap.values())
      .filter(d => isWithinInterval(d.dateObj, { 
        start: startOfDay(dateRange.from), 
        end: endOfDay(dateRange.to) 
      }))
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  }, [aquariumId, waterParameters, journalEntries, fertilizers, dateRange]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const waterParams = chartData.filter(d => d.pH !== undefined);
    const journalDays = chartData.filter(d => d.hasWaterChange !== undefined);
    
    const waterChanges = journalDays.filter(d => d.hasWaterChange).length;
    const totalWaterChangePercent = journalDays
      .filter(d => d.hasWaterChange && d.waterChangePercent)
      .reduce((sum, d) => sum + (d.waterChangePercent || 0), 0);
    
    const totalDosing = chartData.reduce((sum, d) => sum + (d.totalDosing || 0), 0);
    const dosingDays = chartData.filter(d => d.totalDosing && d.totalDosing > 0).length;
    
    const vacuumDays = journalDays.filter(d => d.hasVacuumed).length;
    const trimDays = journalDays.filter(d => d.hasTrimmed).length;
    const filterCleanDays = journalDays.filter(d => d.hasFilterCleaned).length;

    // Averages
    const avgpH = waterParams.length > 0 
      ? waterParams.reduce((sum, d) => sum + (d.pH || 0), 0) / waterParams.length 
      : 0;
    const avgTemp = waterParams.length > 0 
      ? waterParams.reduce((sum, d) => sum + (d.temperature || 0), 0) / waterParams.length 
      : 0;
    const avgNitrate = waterParams.length > 0 
      ? waterParams.reduce((sum, d) => sum + (d.nitrate || 0), 0) / waterParams.length 
      : 0;

    return {
      totalDays: chartData.length,
      waterChanges,
      avgWaterChangePercent: waterChanges > 0 ? Math.round(totalWaterChangePercent / waterChanges) : 0,
      totalDosing: Math.round(totalDosing * 10) / 10,
      dosingDays,
      avgDosingPerDay: dosingDays > 0 ? Math.round((totalDosing / dosingDays) * 10) / 10 : 0,
      vacuumDays,
      trimDays,
      filterCleanDays,
      avgpH: Math.round(avgpH * 10) / 10,
      avgTemp: Math.round(avgTemp * 10) / 10,
      avgNitrate: Math.round(avgNitrate * 10) / 10,
      nitrateInEIRange: avgNitrate >= EI_TARGETS.nitrateMin && avgNitrate <= EI_TARGETS.nitrateMax,
    };
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const dataPoint = chartData.find(d => d.date === label);
    if (!dataPoint) return null;

    return (
      <div className="bg-card theme-border border-border p-3 shadow-md max-w-xs">
        <p className="font-bold text-sm mb-2">
          {format(parseISO(label), 'd. MMMM yyyy', { locale: cs })}
        </p>
        
        {/* Water params */}
        {(dataPoint.pH !== undefined || dataPoint.temperature !== undefined) && (
          <div className="space-y-1 mb-2">
            {dataPoint.pH !== undefined && (
              <p className="text-xs"><span className="text-muted-foreground">pH:</span> {dataPoint.pH}</p>
            )}
            {dataPoint.temperature !== undefined && (
              <p className="text-xs"><span className="text-muted-foreground">Teplota:</span> {dataPoint.temperature}°C</p>
            )}
            {dataPoint.nitrate !== undefined && (
              <p className="text-xs"><span className="text-muted-foreground">NO₃:</span> {dataPoint.nitrate} ppm</p>
            )}
          </div>
        )}

        {/* Maintenance */}
        {(dataPoint.hasWaterChange || dataPoint.hasVacuumed || dataPoint.hasTrimmed || dataPoint.hasFilterCleaned) && (
          <div className="flex flex-wrap gap-1 mb-2">
            {dataPoint.hasWaterChange && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Droplets className="h-3 w-3" />
                {dataPoint.waterChangePercent}%
              </Badge>
            )}
            {dataPoint.hasVacuumed && (
              <Badge variant="secondary" className="text-xs">Odsávání</Badge>
            )}
            {dataPoint.hasTrimmed && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Scissors className="h-3 w-3" />
              </Badge>
            )}
            {dataPoint.hasFilterCleaned && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Filter className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}

        {/* Dosing */}
        {dataPoint.dosingDetails && dataPoint.dosingDetails.length > 0 && (
          <div className="space-y-1 mb-2">
            <p className="text-xs font-medium text-muted-foreground">Dávkování:</p>
            {dataPoint.dosingDetails.map((d, i) => (
              <p key={i} className="text-xs pl-2">
                {d.name}: {d.amount} {d.unit}
              </p>
            ))}
          </div>
        )}

        {/* Notes */}
        {dataPoint.notes && (
          <div className="border-t border-border pt-2 mt-2">
            <p className="text-xs text-muted-foreground italic">
              "{dataPoint.notes.slice(0, 100)}{dataPoint.notes.length > 100 ? '...' : ''}"
            </p>
          </div>
        )}
      </div>
    );
  };

  const toggleVisibility = (key: keyof VisibilityState) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (chartData.length < 2) {
    return (
      <div className="theme-empty">
        <p>Přidejte alespoň 2 záznamy pro zobrazení grafu</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Zoom buttons */}
        <div className="flex gap-1">
          {(['week', 'month', '3months'] as const).map(range => (
            <Button
              key={range}
              variant={zoomRange === range ? 'default' : 'outline'}
              size="sm"
              className=""
              onClick={() => setZoomRange(range)}
            >
              {range === 'week' ? '7D' : range === 'month' ? '1M' : '3M'}
            </Button>
          ))}
          
          {/* Custom date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={zoomRange === 'custom' ? 'default' : 'outline'} 
                size="sm" 
                className="gap-1"
              >
                <Calendar className="h-3 w-3" />
                Vlastní
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarPicker
                mode="range"
                selected={{ from: customDateRange.from, to: customDateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setCustomDateRange({ from: range.from, to: range.to });
                    setZoomRange('custom');
                  }
                }}
                numberOfMonths={2}
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Visibility toggle */}
        <Popover open={showSettings} onOpenChange={setShowSettings}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 ml-auto">
              <Eye className="h-3 w-3" />
              Zobrazit
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-3">
              <p className="font-bold text-sm">Zobrazené hodnoty</p>
              <div className="space-y-2">
                {[
                  { key: 'pH' as const, label: 'pH' },
                  { key: 'temperature' as const, label: 'Teplota' },
                  { key: 'nitrate' as const, label: 'NO₃' },
                  { key: 'ammonia' as const, label: 'NH₃' },
                  { key: 'nitrite' as const, label: 'NO₂' },
                  { key: 'kh' as const, label: 'KH' },
                  { key: 'gh' as const, label: 'GH' },
                  { key: 'waterChange' as const, label: 'Výměna vody' },
                  { key: 'dosing' as const, label: 'Dávkování' },
                  { key: 'maintenance' as const, label: 'Údržba' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={key}
                      checked={visibility[key]}
                      onCheckedChange={() => toggleVisibility(key)}
                    />
                    <Label htmlFor={key} className="text-sm cursor-pointer">{label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Chart */}
      <Card className="p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11}
                tickFormatter={(v) => format(parseISO(v), 'd.M.', { locale: cs })}
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11} 
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* EI target zone for nitrate */}
              {visibility.nitrate && (
                <ReferenceArea 
                  yAxisId="left"
                  y1={EI_TARGETS.nitrateMin} 
                  y2={EI_TARGETS.nitrateMax} 
                  fill="hsl(var(--chart-3))" 
                  fillOpacity={0.1}
                  label={{ value: 'EI cíl', position: 'insideTopRight', fontSize: 10 }}
                />
              )}

              {/* Water parameters lines */}
              {visibility.pH && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="pH" 
                  name="pH"
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  connectNulls
                />
              )}
              {visibility.temperature && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="temperature" 
                  name="°C"
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  connectNulls
                />
              )}
              {visibility.nitrate && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="nitrate" 
                  name="NO₃"
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  connectNulls
                />
              )}
              {visibility.ammonia && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="ammonia" 
                  name="NH₃"
                  stroke="hsl(var(--chart-4))" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  connectNulls
                />
              )}
              {visibility.nitrite && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="nitrite" 
                  name="NO₂"
                  stroke="hsl(var(--chart-5))" 
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  connectNulls
                />
              )}

              {/* Water change bars */}
              {visibility.waterChange && (
                <Bar 
                  yAxisId="right"
                  dataKey="waterChangePercent" 
                  name="Výměna vody %"
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                  radius={[2, 2, 0, 0]}
                />
              )}

              {/* Dosing indicator */}
              {visibility.dosing && (
                <Line 
                  yAxisId="left"
                  type="stepAfter" 
                  dataKey="totalDosing" 
                  name="Dávkování (ml)"
                  stroke="hsl(var(--accent-foreground))" 
                  strokeWidth={1} 
                  strokeDasharray="5 5"
                  dot={{ r: 2 }}
                  connectNulls
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Statistics Table */}
      <Card className="p-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
          Statistiky za období
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Výměny vody</p>
            <p className="text-xl font-bold">{statistics.waterChanges}×</p>
            <p className="text-xs text-muted-foreground">
              Ø {statistics.avgWaterChangePercent}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Dávkování</p>
            <p className="text-xl font-bold">{statistics.totalDosing} ml</p>
            <p className="text-xs text-muted-foreground">
              Ø {statistics.avgDosingPerDay} ml/den
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Údržba</p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs gap-1">
                <Leaf className="h-3 w-3" />
                {statistics.trimDays}×
              </Badge>
              <Badge variant="secondary" className="text-xs gap-1">
                <Filter className="h-3 w-3" />
                {statistics.filterCleanDays}×
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Odsávání: {statistics.vacuumDays}×
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Průměry</p>
            <div className="text-sm space-y-0.5">
              <p>pH: <span className="font-medium">{statistics.avgpH}</span></p>
              <p>°C: <span className="font-medium">{statistics.avgTemp}</span></p>
              <p className="flex items-center gap-1">
                NO₃: <span className="font-medium">{statistics.avgNitrate}</span>
                {statistics.avgNitrate > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs",
                      statistics.nitrateInEIRange 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {statistics.nitrateInEIRange ? 'EI ✓' : 'EI ✗'}
                  </Badge>
                )}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* EI Comparison */}
      <Card className="p-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">
          Porovnání s Estimative Index
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">NO₃ cíl</p>
            <p className="font-medium">{EI_TARGETS.nitrateMin}-{EI_TARGETS.nitrateMax} ppm</p>
            <p className={cn(
              "text-xs",
              statistics.nitrateInEIRange ? "text-primary" : "text-muted-foreground"
            )}>
              Průměr: {statistics.avgNitrate} ppm
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">PO₄ cíl</p>
            <p className="font-medium">{EI_TARGETS.phosphateMin}-{EI_TARGETS.phosphateMax} ppm</p>
          </div>
          <div>
            <p className="text-muted-foreground">K cíl</p>
            <p className="font-medium">{EI_TARGETS.potassiumMin}-{EI_TARGETS.potassiumMax} ppm</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fe cíl</p>
            <p className="font-medium">{EI_TARGETS.ironMin}-{EI_TARGETS.ironMax} ppm</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          💡 Pro detailní analýzu dávkování přejděte do Deníku → EI panel
        </p>
      </Card>
    </div>
  );
};
