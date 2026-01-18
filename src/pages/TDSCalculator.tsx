import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageWrapper, PageHeader } from '@/components/common';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Beaker, Calculator, RotateCcw, Target, Info, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Common remineralizers with their TDS contribution per gram per liter
interface Remineralizer {
  id: string;
  name: string;
  tdsPerGram: number; // TDS increase per gram per liter
  ghPerGram: number;  // GH increase per gram per liter
  khPerGram: number;  // KH increase per gram per liter
  description: string;
}

const COMMON_REMINERALIZERS: Remineralizer[] = [
  { id: 'salty-shrimp-gh', name: 'Salty Shrimp GH+', tdsPerGram: 30, ghPerGram: 3, khPerGram: 0, description: 'Pure GH, no KH' },
  { id: 'salty-shrimp-ghkh', name: 'Salty Shrimp GH/KH+', tdsPerGram: 27, ghPerGram: 1.5, khPerGram: 0.75, description: 'Balanced GH/KH' },
  { id: 'seachem-equilibrium', name: 'Seachem Equilibrium', tdsPerGram: 25, ghPerGram: 2.5, khPerGram: 0, description: 'Plant-focused GH' },
  { id: 'brightwell-remineralizer', name: 'Brightwell Remineralizer', tdsPerGram: 28, ghPerGram: 2, khPerGram: 1, description: 'General purpose' },
  { id: 'custom', name: 'Custom / Other', tdsPerGram: 0, ghPerGram: 0, khPerGram: 0, description: 'Enter your own values' },
];

// Presets for different livestock
const TDS_PRESETS = [
  { name: 'Caridina', tdsMin: 100, tdsMax: 120, ghMin: 4, ghMax: 6, khMin: 0, khMax: 1 },
  { name: 'Neocaridina', tdsMin: 150, tdsMax: 250, ghMin: 6, ghMax: 10, khMin: 2, khMax: 6 },
  { name: 'Discus', tdsMin: 50, tdsMax: 150, ghMin: 1, ghMax: 4, khMin: 1, khMax: 3 },
  { name: 'General Planted', tdsMin: 100, tdsMax: 300, ghMin: 4, ghMax: 8, khMin: 2, khMax: 5 },
];

interface CalculationResult {
  gramsNeeded: number;
  gramsPerLiter: number;
  resultingTds: number;
  resultingGh: number;
  resultingKh: number;
}

const TDSCalculator = () => {
  const { t } = useI18n();

  // Mode: calculate from TDS target or from GH target
  const [mode, setMode] = useState<'tds' | 'gh'>('tds');

  // Water parameters
  const [volume, setVolume] = useState(10);
  const [startingTds, setStartingTds] = useState(0);

  // Target parameters
  const [targetTds, setTargetTds] = useState(150);
  const [targetGh, setTargetGh] = useState(6);

  // Remineralizer selection
  const [selectedRemineralizer, setSelectedRemineralizer] = useState<string>('salty-shrimp-ghkh');
  const [customTdsPerGram, setCustomTdsPerGram] = useState(25);
  const [customGhPerGram, setCustomGhPerGram] = useState(2);
  const [customKhPerGram, setCustomKhPerGram] = useState(1);

  // Result
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Get current remineralizer data
  const currentRemineralizer = useMemo(() => {
    const preset = COMMON_REMINERALIZERS.find(r => r.id === selectedRemineralizer);
    if (!preset || selectedRemineralizer === 'custom') {
      return {
        tdsPerGram: customTdsPerGram,
        ghPerGram: customGhPerGram,
        khPerGram: customKhPerGram,
      };
    }
    return preset;
  }, [selectedRemineralizer, customTdsPerGram, customGhPerGram, customKhPerGram]);

  const handleCalculate = () => {
    const { tdsPerGram, ghPerGram, khPerGram } = currentRemineralizer;

    if (tdsPerGram <= 0 && mode === 'tds') {
      toast.error(t.tools.enterValidTdsPerGram);
      return;
    }
    if (ghPerGram <= 0 && mode === 'gh') {
      toast.error(t.tools.enterValidGhPerGram);
      return;
    }

    let gramsPerLiter: number;

    if (mode === 'tds') {
      // Calculate grams needed to reach target TDS
      const tdsNeeded = targetTds - startingTds;
      if (tdsNeeded <= 0) {
        toast.error(t.tools.targetAlreadyReached);
        return;
      }
      gramsPerLiter = tdsNeeded / tdsPerGram;
    } else {
      // Calculate grams needed to reach target GH
      gramsPerLiter = targetGh / ghPerGram;
    }

    const gramsNeeded = Math.round(gramsPerLiter * volume * 100) / 100;
    const resultingTds = Math.round(startingTds + (gramsPerLiter * tdsPerGram));
    const resultingGh = Math.round(gramsPerLiter * ghPerGram * 10) / 10;
    const resultingKh = Math.round(gramsPerLiter * khPerGram * 10) / 10;

    setResult({
      gramsNeeded,
      gramsPerLiter: Math.round(gramsPerLiter * 1000) / 1000,
      resultingTds,
      resultingGh,
      resultingKh,
    });

    toast.success(t.tools.calculationComplete);
  };

  const handleReset = () => {
    setMode('tds');
    setVolume(10);
    setStartingTds(0);
    setTargetTds(150);
    setTargetGh(6);
    setSelectedRemineralizer('salty-shrimp-ghkh');
    setCustomTdsPerGram(25);
    setCustomGhPerGram(2);
    setCustomKhPerGram(1);
    setResult(null);
  };

  const applyPreset = (preset: typeof TDS_PRESETS[0]) => {
    setTargetTds(Math.round((preset.tdsMin + preset.tdsMax) / 2));
    setTargetGh(Math.round((preset.ghMin + preset.ghMax) / 2));
  };

  return (
    <Layout>
      <PageWrapper>
        <div className="flex items-center gap-4 mb-6">
          <Link to="/tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <PageHeader 
            title={t.tools.tdsCalculator} 
            subtitle={t.tools.tdsCalculatorLongDesc}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                {t.tools.remineralization}
              </CardTitle>
              <CardDescription>
                {t.tools.remineralizationDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Remineralizer Selection */}
              <div className="space-y-2">
                <Label>{t.tools.remineralizerProduct}</Label>
                <Select value={selectedRemineralizer} onValueChange={setSelectedRemineralizer}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_REMINERALIZERS.map(r => (
                      <SelectItem key={r.id} value={r.id}>
                        <div className="flex flex-col">
                          <span>{r.name}</span>
                          {r.id !== 'custom' && (
                            <span className="text-xs text-muted-foreground">{r.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom values */}
              {selectedRemineralizer === 'custom' && (
                <div className="p-4 rounded-lg bg-muted/50 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">TDS/g/L</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={customTdsPerGram}
                        onChange={(e) => setCustomTdsPerGram(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">GH/g/L</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={customGhPerGram}
                        onChange={(e) => setCustomGhPerGram(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">KH/g/L</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={customKhPerGram}
                        onChange={(e) => setCustomKhPerGram(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Product info for presets */}
              {selectedRemineralizer !== 'custom' && (
                <div className="p-3 rounded-lg bg-muted/50 text-sm">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-muted-foreground text-xs">TDS/g/L</div>
                      <div className="font-medium">{currentRemineralizer.tdsPerGram}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">GH/g/L</div>
                      <div className="font-medium">{currentRemineralizer.ghPerGram}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">KH/g/L</div>
                      <div className="font-medium">{currentRemineralizer.khPerGram}</div>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Volume */}
              <div className="space-y-2">
                <Label>{t.tools.waterVolume}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value) || 1)}
                  />
                  <span className="text-sm text-muted-foreground">{t.aquarium.liters}</span>
                </div>
              </div>

              {/* Starting TDS */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {t.tools.startingTds}
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      {t.tools.startingTdsTooltip}
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={startingTds}
                    onChange={(e) => setStartingTds(parseInt(e.target.value) || 0)}
                  />
                  <span className="text-sm text-muted-foreground">ppm</span>
                </div>
              </div>

              <Separator />

              {/* Mode Selection */}
              <div className="space-y-2">
                <Label>{t.tools.calculateBy}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={mode === 'tds' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('tds')}
                  >
                    {t.tools.byTds}
                  </Button>
                  <Button
                    variant={mode === 'gh' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('gh')}
                  >
                    {t.tools.byGh}
                  </Button>
                </div>
              </div>

              {/* Target based on mode */}
              {mode === 'tds' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t.tools.targetTds}</Label>
                    <Badge variant="secondary">{targetTds} ppm</Badge>
                  </div>
                  <Slider
                    value={[targetTds]}
                    onValueChange={([v]) => setTargetTds(v)}
                    min={0}
                    max={400}
                    step={5}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t.tools.targetGh}</Label>
                    <Badge variant="secondary">{targetGh} °dH</Badge>
                  </div>
                  <Slider
                    value={[targetGh]}
                    onValueChange={([v]) => setTargetGh(v)}
                    min={0}
                    max={15}
                    step={0.5}
                  />
                </div>
              )}

              {/* Presets */}
              <div className="space-y-2">
                <Label>{t.tools.presets}</Label>
                <div className="flex flex-wrap gap-2">
                  {TDS_PRESETS.map(preset => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={handleCalculate} className="flex-1">
                <Calculator className="h-4 w-4 mr-2" />
                {t.tools.calculate}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Result Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t.tools.result}
              </CardTitle>
              <CardDescription>
                {t.tools.remineralizationResult}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Main result */}
                  <div className="p-6 rounded-xl bg-primary/10 text-center">
                    <p className="text-sm text-muted-foreground mb-1">{t.tools.addToWater}</p>
                    <p className="text-4xl font-bold">{result.gramsNeeded} g</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      ({result.gramsPerLiter} g/{t.aquarium.liters.toLowerCase()})
                    </p>
                  </div>

                  {/* Resulting parameters */}
                  <div className="space-y-3">
                    <h4 className="font-medium">{t.tools.resultingParams}</h4>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <div className="text-xs text-muted-foreground">TDS</div>
                        <div className="text-lg font-bold">{result.resultingTds}</div>
                        <div className="text-xs text-muted-foreground">ppm</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <div className="text-xs text-muted-foreground">GH</div>
                        <div className="text-lg font-bold">{result.resultingGh}</div>
                        <div className="text-xs text-muted-foreground">°dH</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <div className="text-xs text-muted-foreground">KH</div>
                        <div className="text-lg font-bold">{result.resultingKh}</div>
                        <div className="text-xs text-muted-foreground">°dH</div>
                      </div>
                    </div>
                  </div>

                  {/* Preset comparison */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{t.tools.comparisonWithPresets}</h4>
                    <div className="space-y-2">
                      {TDS_PRESETS.map(preset => {
                        const tdsOk = result.resultingTds >= preset.tdsMin && result.resultingTds <= preset.tdsMax;
                        const ghOk = result.resultingGh >= preset.ghMin && result.resultingGh <= preset.ghMax;
                        const isMatch = tdsOk && ghOk;
                        
                        return (
                          <div 
                            key={preset.name}
                            className={`p-2 rounded-lg text-sm flex items-center justify-between ${
                              isMatch ? 'bg-green-500/10' : 'bg-muted/30'
                            }`}
                          >
                            <span>{preset.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                TDS {preset.tdsMin}-{preset.tdsMax}, GH {preset.ghMin}-{preset.ghMax}
                              </span>
                              {isMatch && <Badge variant="default" className="text-xs">✓</Badge>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Beaker className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>{t.tools.enterDataToCalculate}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">{t.tools.tdsInfo}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>{t.tools.tdsInfoDesc}</p>
            <ul className="mt-2 space-y-1">
              <li>{t.tools.tdsTip1}</li>
              <li>{t.tools.tdsTip2}</li>
              <li>{t.tools.tdsTip3}</li>
            </ul>
          </CardContent>
        </Card>
      </PageWrapper>
    </Layout>
  );
};

export default TDSCalculator;
