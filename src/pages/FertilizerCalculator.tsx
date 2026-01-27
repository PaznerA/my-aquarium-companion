import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageWrapper, PageHeader } from '@/components/common';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Calculator, FlaskConical, Save, Copy, RotateCcw, Info, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAppDataContext } from '@/contexts';
import { toast } from 'sonner';
import { EI_TARGETS } from '@/lib/estimativeIndex';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type NutrientKey = 'nitrogen' | 'phosphorus' | 'potassium' | 'iron' | 'magnesium';

interface NutrientInput {
  enabled: boolean;
  eiTarget: number; // percentage of EI
}

interface ManufacturerInput {
  doseAmount: number;
  doseUnit: 'ml' | 'drops';
  tankVolume: number;
  frequency: 'daily' | 'every2days' | 'weekly' | 'biweekly';
}

interface CalculatedNutrient {
  nutrient: NutrientKey;
  ppmPerMl: number;
  ppmPerDose: number;
  weeklyPpm: number;
}

// Calculate how many doses per week based on frequency
const getDosesPerWeek = (frequency: ManufacturerInput['frequency']): number => {
  switch (frequency) {
    case 'daily': return 7;
    case 'every2days': return 3.5;
    case 'weekly': return 1;
    case 'biweekly': return 0.5;
    default: return 1;
  }
};

// Get EI weekly target for a nutrient
const getEIWeeklyTarget = (nutrient: NutrientKey): number => {
  const targets: Record<NutrientKey, number> = {
    nitrogen: (EI_TARGETS.nitrogenMin + EI_TARGETS.nitrogenMax) / 2,
    phosphorus: (EI_TARGETS.phosphorusMin + EI_TARGETS.phosphorusMax) / 2,
    potassium: (EI_TARGETS.potassiumMin + EI_TARGETS.potassiumMax) / 2,
    iron: (EI_TARGETS.ironMin + EI_TARGETS.ironMax) / 2,
    magnesium: (EI_TARGETS.magnesiumMin + EI_TARGETS.magnesiumMax) / 2,
  };
  return targets[nutrient];
};

const FertilizerCalculator = () => {
  const { t } = useI18n();
  const { addFertilizer } = useAppDataContext();

  // Mode: single or multi-nutrient
  const [mode, setMode] = useState<'single' | 'multi'>('single');

  // Manufacturer input state
  const [input, setInput] = useState<ManufacturerInput>({
    doseAmount: 1,
    doseUnit: 'ml',
    tankVolume: 10,
    frequency: 'weekly',
  });

  // Single nutrient mode
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientKey>('phosphorus');
  const [singleEiTarget, setSingleEiTarget] = useState(50);

  // Multi-nutrient mode - each nutrient can have its own EI target
  const [nutrients, setNutrients] = useState<Record<NutrientKey, NutrientInput>>({
    nitrogen: { enabled: false, eiTarget: 50 },
    phosphorus: { enabled: true, eiTarget: 50 },
    potassium: { enabled: false, eiTarget: 50 },
    iron: { enabled: false, eiTarget: 50 },
    magnesium: { enabled: false, eiTarget: 50 },
  });

  // Results
  const [calculatedResults, setCalculatedResults] = useState<CalculatedNutrient[]>([]);

  // Name for saving
  const [fertilizerName, setFertilizerName] = useState('');
  const [fertilizerBrand, setFertilizerBrand] = useState('');

  // Calculate ppm per ml for a single nutrient
  const calculatePpmPerMl = (nutrient: NutrientKey, eiTarget: number): number | null => {
    const { doseAmount, tankVolume, frequency } = input;
    
    if (doseAmount <= 0 || tankVolume <= 0 || eiTarget <= 0) {
      return null;
    }

    const dosesPerWeek = getDosesPerWeek(frequency);
    const weeklyDoseTotal = doseAmount * dosesPerWeek;
    const eiWeeklyTarget = getEIWeeklyTarget(nutrient);
    const targetWeeklyPpm = eiWeeklyTarget * (eiTarget / 100);
    const ppmPerMl = (targetWeeklyPpm * tankVolume) / weeklyDoseTotal;
    
    return Math.round(ppmPerMl * 100) / 100;
  };

  const handleCalculate = () => {
    const results: CalculatedNutrient[] = [];
    
    if (mode === 'single') {
      const ppmPerMl = calculatePpmPerMl(selectedNutrient, singleEiTarget);
      if (ppmPerMl !== null) {
        const dosesPerWeek = getDosesPerWeek(input.frequency);
        results.push({
          nutrient: selectedNutrient,
          ppmPerMl,
          ppmPerDose: (ppmPerMl * input.doseAmount) / input.tankVolume,
          weeklyPpm: (ppmPerMl * input.doseAmount * dosesPerWeek) / input.tankVolume,
        });
      }
    } else {
      // Multi-nutrient mode
      Object.entries(nutrients).forEach(([key, config]) => {
        if (config.enabled) {
          const nutrient = key as NutrientKey;
          const ppmPerMl = calculatePpmPerMl(nutrient, config.eiTarget);
          if (ppmPerMl !== null) {
            const dosesPerWeek = getDosesPerWeek(input.frequency);
            results.push({
              nutrient,
              ppmPerMl,
              ppmPerDose: (ppmPerMl * input.doseAmount) / input.tankVolume,
              weeklyPpm: (ppmPerMl * input.doseAmount * dosesPerWeek) / input.tankVolume,
            });
          }
        }
      });
    }
    
    setCalculatedResults(results);
    
    if (results.length > 0) {
      toast.success(t.tools.calculationComplete);
    }
  };

  const handleReset = () => {
    setInput({
      doseAmount: 1,
      doseUnit: 'ml',
      tankVolume: 10,
      frequency: 'weekly',
    });
    setSingleEiTarget(50);
    setNutrients({
      nitrogen: { enabled: false, eiTarget: 50 },
      phosphorus: { enabled: true, eiTarget: 50 },
      potassium: { enabled: false, eiTarget: 50 },
      iron: { enabled: false, eiTarget: 50 },
      magnesium: { enabled: false, eiTarget: 50 },
    });
    setCalculatedResults([]);
    setFertilizerName('');
    setFertilizerBrand('');
  };

  const handleSaveAsFertilizer = () => {
    if (!fertilizerName.trim() || calculatedResults.length === 0) {
      toast.error(t.tools.enterFertilizerName);
      return;
    }

    const newFertilizer = {
      name: fertilizerName.trim(),
      brand: fertilizerBrand.trim() || '',
      volume: 100,
      unit: 'ml' as const,
      nitrogenPpm: calculatedResults.find(r => r.nutrient === 'nitrogen')?.ppmPerMl || 0,
      phosphorusPpm: calculatedResults.find(r => r.nutrient === 'phosphorus')?.ppmPerMl || 0,
      potassiumPpm: calculatedResults.find(r => r.nutrient === 'potassium')?.ppmPerMl || 0,
      ironPpm: calculatedResults.find(r => r.nutrient === 'iron')?.ppmPerMl || 0,
      magnesiumPpm: calculatedResults.find(r => r.nutrient === 'magnesium')?.ppmPerMl || 0,
    };

    addFertilizer(newFertilizer);
    toast.success(t.tools.fertilizerSaved);
  };

  const handleCopyValues = () => {
    const text = calculatedResults.map(r => 
      `${nutrientLabels[r.nutrient]}: ${r.ppmPerMl} ppm/ml`
    ).join('\n');
    navigator.clipboard.writeText(text);
    toast.success(t.tools.copiedToClipboard);
  };

  const nutrientLabels: Record<NutrientKey, string> = {
    nitrogen: t.inventory.nitrogen,
    phosphorus: t.inventory.phosphorus,
    potassium: t.inventory.potassium,
    iron: t.inventory.iron,
    magnesium: t.inventory.magnesium,
  };

  const frequencyLabels: Record<ManufacturerInput['frequency'], string> = {
    daily: t.tools.daily,
    every2days: t.tools.every2Days,
    weekly: t.tools.weekly,
    biweekly: t.tools.biweekly,
  };

  const enabledNutrientsCount = Object.values(nutrients).filter(n => n.enabled).length;

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
            title={t.tools.fertilizerCalculator} 
            subtitle={t.tools.fertilizerCalculatorLongDesc}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                {t.tools.manufacturerSpecs}
              </CardTitle>
              <CardDescription>
                {t.tools.enterManufacturerInfo}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode Toggle */}
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'single' | 'multi')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">{t.tools.singleNutrient}</TabsTrigger>
                  <TabsTrigger value="multi">{t.tools.multiNutrient}</TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="mt-4 space-y-4">
                  {/* Single nutrient selection */}
                  <div className="space-y-2">
                    <Label>{t.tools.nutrientType}</Label>
                    <Select 
                      value={selectedNutrient} 
                      onValueChange={(v) => setSelectedNutrient(v as NutrientKey)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(nutrientLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* EI Target for single */}
                  <div className="space-y-2">
                    <Label>{t.tools.eiTarget}</Label>
                    <Select
                      value={singleEiTarget.toString()}
                      onValueChange={(v) => setSingleEiTarget(parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">1/4 EI (25%)</SelectItem>
                        <SelectItem value="50">1/2 EI (50%)</SelectItem>
                        <SelectItem value="75">3/4 EI (75%)</SelectItem>
                        <SelectItem value="100">Full EI (100%)</SelectItem>
                        <SelectItem value="150">1.5x EI (150%)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {t.tools.targetPpm}: {(getEIWeeklyTarget(selectedNutrient) * singleEiTarget / 100).toFixed(2)} ppm/{t.tools.week}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="multi" className="mt-4 space-y-4">
                  {/* Multi-nutrient configuration */}
                  <p className="text-sm text-muted-foreground">{t.tools.multiNutrientDesc}</p>
                  
                  <div className="space-y-3">
                    {Object.entries(nutrients).map(([key, config]) => {
                      const nutrient = key as NutrientKey;
                      return (
                        <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Checkbox
                            checked={config.enabled}
                            onCheckedChange={(checked) => 
                              setNutrients(prev => ({
                                ...prev,
                                [key]: { ...config, enabled: !!checked }
                              }))
                            }
                          />
                          <span className="flex-1 font-medium text-sm">
                            {nutrientLabels[nutrient]}
                          </span>
                          {config.enabled && (
                            <Select
                              value={config.eiTarget.toString()}
                              onValueChange={(v) => 
                                setNutrients(prev => ({
                                  ...prev,
                                  [key]: { ...config, eiTarget: parseInt(v) }
                                }))
                              }
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="25">25%</SelectItem>
                                <SelectItem value="50">50%</SelectItem>
                                <SelectItem value="75">75%</SelectItem>
                                <SelectItem value="100">100%</SelectItem>
                                <SelectItem value="150">150%</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {enabledNutrientsCount === 0 && (
                    <p className="text-sm text-destructive">{t.tools.selectAtLeastOne}</p>
                  )}
                </TabsContent>
              </Tabs>

              <Separator />

              {/* Common inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.tools.doseAmount}</Label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={input.doseAmount}
                    onChange={(e) => setInput(prev => ({ ...prev, doseAmount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.tools.doseUnit}</Label>
                  <Select 
                    value={input.doseUnit}
                    onValueChange={(v) => setInput(prev => ({ ...prev, doseUnit: v as 'ml' | 'drops' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="drops">{t.tools.drops}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t.tools.tankVolume}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={input.tankVolume}
                    onChange={(e) => setInput(prev => ({ ...prev, tankVolume: parseInt(e.target.value) || 1 }))}
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {t.aquarium.liters}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t.tools.dosingFrequency}</Label>
                <Select
                  value={input.frequency}
                  onValueChange={(v) => setInput(prev => ({ ...prev, frequency: v as ManufacturerInput['frequency'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(frequencyLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                onClick={handleCalculate} 
                className="flex-1"
                disabled={mode === 'multi' && enabledNutrientsCount === 0}
              >
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
                <Calculator className="h-5 w-5" />
                {t.tools.result}
              </CardTitle>
              <CardDescription>
                {t.tools.calculatedNutrientContent}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {calculatedResults.length > 0 ? (
                <>
                  {/* Results list */}
                  <div className="space-y-3">
                    {calculatedResults.map((result) => (
                      <div key={result.nutrient} className="p-4 rounded-xl bg-primary/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{nutrientLabels[result.nutrient]}</span>
                          <Badge variant="secondary">{result.ppmPerMl} ppm/ml</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <span>{t.tools.perDose}: {result.ppmPerDose.toFixed(2)} ppm</span>
                          <span>{t.tools.perWeek}: {result.weeklyPpm.toFixed(2)} ppm</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full" onClick={handleCopyValues}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t.tools.copyValue}
                  </Button>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">{t.tools.saveAsFertilizer}</h4>
                    <div className="space-y-2">
                      <Label>{t.inventory.name}</Label>
                      <Input
                        value={fertilizerName}
                        onChange={(e) => setFertilizerName(e.target.value)}
                        placeholder={t.tools.fertilizerNamePlaceholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.inventory.brand} ({t.common.optional})</Label>
                      <Input
                        value={fertilizerBrand}
                        onChange={(e) => setFertilizerBrand(e.target.value)}
                        placeholder="ProfiPlants, Seachem..."
                      />
                    </div>
                    <Button 
                      onClick={handleSaveAsFertilizer} 
                      className="w-full"
                      disabled={!fertilizerName.trim()}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {t.tools.saveFertilizer}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>{t.tools.enterDataToCalculate}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">{t.tools.howItWorks}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>{t.tools.howItWorksDesc}</p>
            <ul className="mt-2 space-y-1">
              <li>{t.tools.howItWorksStep1}</li>
              <li>{t.tools.howItWorksStep2}</li>
              <li>{t.tools.howItWorksStep3}</li>
            </ul>
          </CardContent>
        </Card>
      </PageWrapper>
    </Layout>
  );
};

export default FertilizerCalculator;