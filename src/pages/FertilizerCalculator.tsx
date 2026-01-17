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
import { ArrowLeft, Calculator, FlaskConical, Save, Copy, RotateCcw, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAppData } from '@/hooks/useAppData';
import { toast } from 'sonner';
import { EI_TARGETS } from '@/lib/estimativeIndex';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type NutrientKey = 'nitrogen' | 'phosphorus' | 'potassium' | 'iron' | 'magnesium';

interface CalculationResult {
  nutrient: NutrientKey;
  ppmPerMl: number;
  ppmPerDose: number;
  weeklyPpm: number;
  eiPercentage: number;
}

interface ManufacturerInput {
  doseAmount: number;
  doseUnit: 'ml' | 'drops';
  tankVolume: number;
  frequency: 'daily' | 'every2days' | 'weekly' | 'biweekly';
  eiTarget: number; // percentage of EI (e.g., 50 = 1/2 EI)
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
    nitrogen: (EI_TARGETS.nitrogenMin + EI_TARGETS.nitrogenMax) / 2, // ~15 ppm
    phosphorus: (EI_TARGETS.phosphorusMin + EI_TARGETS.phosphorusMax) / 2, // ~1.5 ppm
    potassium: (EI_TARGETS.potassiumMin + EI_TARGETS.potassiumMax) / 2, // ~25 ppm
    iron: (EI_TARGETS.ironMin + EI_TARGETS.ironMax) / 2, // ~0.25 ppm
    magnesium: (EI_TARGETS.magnesiumMin + EI_TARGETS.magnesiumMax) / 2, // ~10 ppm
  };
  return targets[nutrient];
};

const FertilizerCalculator = () => {
  const { t } = useI18n();
  const { data, addFertilizer } = useAppData();

  // Manufacturer input state
  const [input, setInput] = useState<ManufacturerInput>({
    doseAmount: 1,
    doseUnit: 'ml',
    tankVolume: 10,
    frequency: 'weekly',
    eiTarget: 50,
  });

  // Selected nutrient for calculation
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientKey>('phosphorus');
  
  // Result state
  const [calculatedPpm, setCalculatedPpm] = useState<number | null>(null);
  
  // Name for saving new fertilizer
  const [fertilizerName, setFertilizerName] = useState('');
  const [fertilizerBrand, setFertilizerBrand] = useState('');

  // Calculate ppm per ml based on manufacturer specs
  const calculatePpmPerMl = (): number | null => {
    const { doseAmount, tankVolume, frequency, eiTarget } = input;
    
    if (doseAmount <= 0 || tankVolume <= 0 || eiTarget <= 0) {
      return null;
    }

    const dosesPerWeek = getDosesPerWeek(frequency);
    const weeklyDoseTotal = doseAmount * dosesPerWeek; // ml per week
    
    // Target weekly ppm based on EI percentage
    const eiWeeklyTarget = getEIWeeklyTarget(selectedNutrient);
    const targetWeeklyPpm = eiWeeklyTarget * (eiTarget / 100);
    
    // ppm per ml = target ppm / (ml per dose * doses per week / tank volume in liters * 10)
    // Simplified: ppm added = (ml * ppm_per_ml) / tank_volume * 10
    // So: ppm_per_ml = (target_ppm * tank_volume) / (weekly_dose * 10)
    
    // Actually, if dose adds ppm to tank:
    // ppm_per_dose = ppm_per_ml * dose_ml / tank_liters
    // weekly_ppm = ppm_per_dose * doses_per_week
    // So: ppm_per_ml = (weekly_ppm * tank_liters) / (dose_ml * doses_per_week)
    
    const ppmPerMl = (targetWeeklyPpm * tankVolume) / (weeklyDoseTotal);
    
    return Math.round(ppmPerMl * 100) / 100;
  };

  const handleCalculate = () => {
    const result = calculatePpmPerMl();
    setCalculatedPpm(result);
    
    if (result !== null) {
      toast.success(t.tools.calculationComplete);
    }
  };

  const handleReset = () => {
    setInput({
      doseAmount: 1,
      doseUnit: 'ml',
      tankVolume: 10,
      frequency: 'weekly',
      eiTarget: 50,
    });
    setCalculatedPpm(null);
    setFertilizerName('');
    setFertilizerBrand('');
  };

  const handleSaveAsFertilizer = () => {
    if (!fertilizerName.trim() || calculatedPpm === null) {
      toast.error(t.tools.enterFertilizerName);
      return;
    }

    const newFertilizer = {
      name: fertilizerName.trim(),
      brand: fertilizerBrand.trim() || '',
      volume: 100,
      unit: 'ml' as const,
      nitrogenPpm: selectedNutrient === 'nitrogen' ? calculatedPpm : 0,
      phosphorusPpm: selectedNutrient === 'phosphorus' ? calculatedPpm : 0,
      potassiumPpm: selectedNutrient === 'potassium' ? calculatedPpm : 0,
      ironPpm: selectedNutrient === 'iron' ? calculatedPpm : 0,
      magnesiumPpm: selectedNutrient === 'magnesium' ? calculatedPpm : 0,
    };

    addFertilizer(newFertilizer);
    toast.success(t.tools.fertilizerSaved);
  };

  const handleCopyValue = () => {
    if (calculatedPpm !== null) {
      navigator.clipboard.writeText(calculatedPpm.toString());
      toast.success(t.tools.copiedToClipboard);
    }
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

  // Show what EI target means in ppm
  const eiTargetInfo = useMemo(() => {
    const weeklyTarget = getEIWeeklyTarget(selectedNutrient);
    const actualTarget = weeklyTarget * (input.eiTarget / 100);
    return {
      fullEI: weeklyTarget,
      actual: actualTarget,
    };
  }, [selectedNutrient, input.eiTarget]);

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
              {/* Nutrient Selection */}
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

              <Separator />

              {/* Dose Amount */}
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

              {/* Tank Volume */}
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

              {/* Frequency */}
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

              <Separator />

              {/* EI Target */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>{t.tools.eiTarget}</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{t.tools.eiTargetTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={input.eiTarget.toString()}
                  onValueChange={(v) => setInput(prev => ({ ...prev, eiTarget: parseInt(v) }))}
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
                  {t.tools.targetPpm}: {eiTargetInfo.actual.toFixed(2)} ppm/{t.tools.week} 
                  <span className="opacity-60"> (Full EI: {eiTargetInfo.fullEI.toFixed(2)} ppm)</span>
                </p>
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
                <Calculator className="h-5 w-5" />
                {t.tools.result}
              </CardTitle>
              <CardDescription>
                {t.tools.calculatedNutrientContent}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {calculatedPpm !== null ? (
                <>
                  <div className="p-6 rounded-xl bg-primary/10 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {nutrientLabels[selectedNutrient]} {t.tools.perMl}
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {calculatedPpm} <span className="text-lg font-normal">ppm</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-muted-foreground">{t.tools.perDose}</p>
                      <p className="font-medium">
                        {((calculatedPpm * input.doseAmount) / input.tankVolume).toFixed(2)} ppm
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-muted-foreground">{t.tools.perWeek}</p>
                      <p className="font-medium">
                        {((calculatedPpm * input.doseAmount * getDosesPerWeek(input.frequency)) / input.tankVolume).toFixed(2)} ppm
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={handleCopyValue}>
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
