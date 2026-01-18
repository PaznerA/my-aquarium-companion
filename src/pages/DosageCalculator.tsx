import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageWrapper, PageHeader } from '@/components/common';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Droplets, Calculator, Info, RotateCcw, Target, Leaf, Sun, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useAppData } from '@/hooks/useAppData';
import { toast } from 'sonner';
import { 
  EI_TARGETS, 
  calculateConsumptionMultiplier, 
  getConsumptionDescription 
} from '@/lib/estimativeIndex';
import type { PlantDensity, LightLevel, Fertilizer } from '@/lib/storage';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DosingResult {
  fertilizerId: string;
  fertilizerName: string;
  dailyDose: number;
  weeklyDose: number;
  unit: 'ml' | 'g';
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    iron: number;
    magnesium: number;
  };
}

const DosageCalculator = () => {
  const { t, language } = useI18n();
  const { data } = useAppData();

  // Aquarium parameters
  const [selectedAquariumId, setSelectedAquariumId] = useState<string>('custom');
  const [customVolume, setCustomVolume] = useState(100);
  const [plantDensity, setPlantDensity] = useState<PlantDensity>('medium');
  const [hasCO2, setHasCO2] = useState(false);
  const [lightLevel, setLightLevel] = useState<LightLevel>('medium');

  // EI target percentage
  const [eiTargetPercent, setEiTargetPercent] = useState(100);

  // Selected fertilizers
  const [selectedFertilizers, setSelectedFertilizers] = useState<string[]>([]);

  // Results
  const [results, setResults] = useState<DosingResult[]>([]);

  // Get current aquarium if selected
  const selectedAquarium = useMemo(() => 
    data.aquariums.find(a => a.id === selectedAquariumId),
    [data.aquariums, selectedAquariumId]
  );

  // Effective parameters (from selected aquarium or custom)
  const effectiveParams = useMemo(() => {
    if (selectedAquarium) {
      return {
        volume: selectedAquarium.volume,
        plantDensity: selectedAquarium.plantDensity || 'medium',
        hasCO2: selectedAquarium.hasCO2 || false,
        lightLevel: selectedAquarium.lightLevel || 'medium',
      };
    }
    return {
      volume: customVolume,
      plantDensity,
      hasCO2,
      lightLevel,
    };
  }, [selectedAquarium, customVolume, plantDensity, hasCO2, lightLevel]);

  // Calculate consumption multiplier
  const consumptionMultiplier = useMemo(() => 
    calculateConsumptionMultiplier(effectiveParams),
    [effectiveParams]
  );

  // Adjusted EI targets based on consumption
  const adjustedTargets = useMemo(() => ({
    nitrogen: ((EI_TARGETS.nitrogenMin + EI_TARGETS.nitrogenMax) / 2) * consumptionMultiplier * (eiTargetPercent / 100),
    phosphorus: ((EI_TARGETS.phosphorusMin + EI_TARGETS.phosphorusMax) / 2) * consumptionMultiplier * (eiTargetPercent / 100),
    potassium: ((EI_TARGETS.potassiumMin + EI_TARGETS.potassiumMax) / 2) * consumptionMultiplier * (eiTargetPercent / 100),
    iron: ((EI_TARGETS.ironMin + EI_TARGETS.ironMax) / 2) * consumptionMultiplier * (eiTargetPercent / 100),
    magnesium: ((EI_TARGETS.magnesiumMin + EI_TARGETS.magnesiumMax) / 2) * consumptionMultiplier * (eiTargetPercent / 100),
  }), [consumptionMultiplier, eiTargetPercent]);

  const toggleFertilizer = (id: string) => {
    setSelectedFertilizers(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const handleCalculate = () => {
    if (selectedFertilizers.length === 0) {
      toast.error(t.tools.selectFertilizers);
      return;
    }

    const newResults: DosingResult[] = [];
    const volume = effectiveParams.volume;

    selectedFertilizers.forEach(fertId => {
      const fert = data.fertilizers.find(f => f.id === fertId);
      if (!fert) return;

      // Calculate how much of this fertilizer is needed to hit targets
      // We use the primary nutrient (highest ppm) as the limiting factor
      const nutrients = {
        nitrogen: fert.nitrogenPpm || 0,
        phosphorus: fert.phosphorusPpm || 0,
        potassium: fert.potassiumPpm || 0,
        iron: fert.ironPpm || 0,
        magnesium: fert.magnesiumPpm || 0,
      };

      // Find the "best fit" - calculate dose for each nutrient and use the most reasonable one
      const doses: { nutrient: string; weeklyMl: number }[] = [];

      if (nutrients.nitrogen > 0) {
        // ml needed = (target_ppm * volume) / ppm_per_ml
        const weeklyMl = (adjustedTargets.nitrogen * volume) / nutrients.nitrogen;
        doses.push({ nutrient: 'nitrogen', weeklyMl });
      }
      if (nutrients.phosphorus > 0) {
        const weeklyMl = (adjustedTargets.phosphorus * volume) / nutrients.phosphorus;
        doses.push({ nutrient: 'phosphorus', weeklyMl });
      }
      if (nutrients.potassium > 0) {
        const weeklyMl = (adjustedTargets.potassium * volume) / nutrients.potassium;
        doses.push({ nutrient: 'potassium', weeklyMl });
      }
      if (nutrients.iron > 0) {
        const weeklyMl = (adjustedTargets.iron * volume) / nutrients.iron;
        doses.push({ nutrient: 'iron', weeklyMl });
      }
      if (nutrients.magnesium > 0) {
        const weeklyMl = (adjustedTargets.magnesium * volume) / nutrients.magnesium;
        doses.push({ nutrient: 'magnesium', weeklyMl });
      }

      if (doses.length === 0) return;

      // Use the minimum dose to avoid overdosing any nutrient
      const minDose = Math.min(...doses.map(d => d.weeklyMl));
      const weeklyDose = Math.round(minDose * 10) / 10;
      const dailyDose = Math.round((weeklyDose / 7) * 10) / 10;

      // Calculate actual nutrients delivered at this dose
      const deliveredNutrients = {
        nitrogen: Math.round((weeklyDose * nutrients.nitrogen / volume) * 100) / 100,
        phosphorus: Math.round((weeklyDose * nutrients.phosphorus / volume) * 100) / 100,
        potassium: Math.round((weeklyDose * nutrients.potassium / volume) * 100) / 100,
        iron: Math.round((weeklyDose * nutrients.iron / volume) * 1000) / 1000,
        magnesium: Math.round((weeklyDose * nutrients.magnesium / volume) * 100) / 100,
      };

      newResults.push({
        fertilizerId: fert.id,
        fertilizerName: fert.name,
        dailyDose,
        weeklyDose,
        unit: fert.unit,
        nutrients: deliveredNutrients,
      });
    });

    setResults(newResults);
    
    if (newResults.length > 0) {
      toast.success(t.tools.calculationComplete);
    }
  };

  const handleReset = () => {
    setSelectedAquariumId('custom');
    setCustomVolume(100);
    setPlantDensity('medium');
    setHasCO2(false);
    setLightLevel('medium');
    setEiTargetPercent(100);
    setSelectedFertilizers([]);
    setResults([]);
  };

  const densityLabels: Record<PlantDensity, string> = {
    low: t.inventory.plantDensityLow,
    medium: t.inventory.plantDensityMedium,
    high: t.inventory.plantDensityHigh,
    dutch: t.inventory.plantDensityDutch,
  };

  const lightLabels: Record<LightLevel, string> = {
    low: t.inventory.lightLevelLow,
    medium: t.inventory.lightLevelMedium,
    high: t.inventory.lightLevelHigh,
  };

  // Total weekly nutrients from all results
  const totalNutrients = useMemo(() => {
    return results.reduce((acc, r) => ({
      nitrogen: acc.nitrogen + r.nutrients.nitrogen,
      phosphorus: acc.phosphorus + r.nutrients.phosphorus,
      potassium: acc.potassium + r.nutrients.potassium,
      iron: acc.iron + r.nutrients.iron,
      magnesium: acc.magnesium + r.nutrients.magnesium,
    }), { nitrogen: 0, phosphorus: 0, potassium: 0, iron: 0, magnesium: 0 });
  }, [results]);

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
            title={t.tools.dosageCalculator} 
            subtitle={t.tools.dosageCalculatorLongDesc}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Parameters Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t.tools.aquariumParams}
              </CardTitle>
              <CardDescription>
                {t.tools.aquariumParamsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Aquarium Selection */}
              <div className="space-y-2">
                <Label>{t.tools.selectAquarium}</Label>
                <Select 
                  value={selectedAquariumId}
                  onValueChange={setSelectedAquariumId}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">{t.tools.customParams}</SelectItem>
                    {data.aquariums.map(aq => (
                      <SelectItem key={aq.id} value={aq.id}>
                        {aq.name} ({aq.volume}L)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAquariumId === 'custom' ? (
                <>
                  {/* Custom Volume */}
                  <div className="space-y-2">
                    <Label>{t.tools.tankVolume}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={customVolume}
                        onChange={(e) => setCustomVolume(parseInt(e.target.value) || 1)}
                      />
                      <span className="text-sm text-muted-foreground">{t.aquarium.liters}</span>
                    </div>
                  </div>

                  {/* Plant Density */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      {t.inventory.plantDensity}
                    </Label>
                    <Select value={plantDensity} onValueChange={(v) => setPlantDensity(v as PlantDensity)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(densityLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* CO2 */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <Wind className="h-4 w-4" />
                      {t.inventory.hasCO2}
                    </Label>
                    <Switch checked={hasCO2} onCheckedChange={setHasCO2} />
                  </div>

                  {/* Light Level */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      {t.inventory.lightLevel}
                    </Label>
                    <Select value={lightLevel} onValueChange={(v) => setLightLevel(v as LightLevel)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(lightLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                /* Show selected aquarium info */
                selectedAquarium && (
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.tools.tankVolume}:</span>
                      <span>{selectedAquarium.volume}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.inventory.plantDensity}:</span>
                      <span>{densityLabels[selectedAquarium.plantDensity || 'medium']}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CO₂:</span>
                      <span>{selectedAquarium.hasCO2 ? t.common.yes : t.common.no}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.inventory.lightLevel}:</span>
                      <span>{lightLabels[selectedAquarium.lightLevel || 'medium']}</span>
                    </div>
                  </div>
                )
              )}

              <Separator />

              {/* Consumption indicator */}
              <div className="p-4 rounded-lg bg-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t.inventory.consumptionMultiplier}</span>
                  <Badge variant="secondary">{consumptionMultiplier.toFixed(1)}×</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getConsumptionDescription(consumptionMultiplier, language)}
                </p>
              </div>

              {/* EI Target */}
              <div className="space-y-2">
                <Label>{t.tools.eiTargetPercent}</Label>
                <Select
                  value={eiTargetPercent.toString()}
                  onValueChange={(v) => setEiTargetPercent(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50% EI ({t.tools.lowTech})</SelectItem>
                    <SelectItem value="75">75% EI</SelectItem>
                    <SelectItem value="100">100% EI ({t.tools.standard})</SelectItem>
                    <SelectItem value="150">150% EI ({t.tools.highTech})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Fertilizers Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                {t.tools.selectFertilizersTitle}
              </CardTitle>
              <CardDescription>
                {t.tools.selectFertilizersDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.fertilizers.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Droplets className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>{t.journal.addFertilizersHint}</p>
                  <Link to="/inventory">
                    <Button variant="link" className="mt-2">{t.inventory.addFertilizer}</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {data.fertilizers.map(fert => {
                    const isSelected = selectedFertilizers.includes(fert.id);
                    const hasNutrients = (fert.nitrogenPpm || 0) + (fert.phosphorusPpm || 0) + 
                      (fert.potassiumPpm || 0) + (fert.ironPpm || 0) + (fert.magnesiumPpm || 0) > 0;
                    
                    return (
                      <div 
                        key={fert.id}
                        onClick={() => hasNutrients && toggleFertilizer(fert.id)}
                        className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : hasNutrients
                              ? 'border-transparent bg-muted/50 hover:bg-muted'
                              : 'border-transparent bg-muted/30 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{fert.name}</p>
                            {fert.brand && (
                              <p className="text-xs text-muted-foreground">{fert.brand}</p>
                            )}
                          </div>
                          {!hasNutrients && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                {t.tools.noNutrientData}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        {hasNutrients && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {fert.nitrogenPpm ? <Badge variant="outline" className="text-xs">N</Badge> : null}
                            {fert.phosphorusPpm ? <Badge variant="outline" className="text-xs">P</Badge> : null}
                            {fert.potassiumPpm ? <Badge variant="outline" className="text-xs">K</Badge> : null}
                            {fert.ironPpm ? <Badge variant="outline" className="text-xs">Fe</Badge> : null}
                            {fert.magnesiumPpm ? <Badge variant="outline" className="text-xs">Mg</Badge> : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                onClick={handleCalculate} 
                className="flex-1"
                disabled={selectedFertilizers.length === 0}
              >
                <Calculator className="h-4 w-4 mr-2" />
                {t.tools.calculate}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Results Card */}
        {results.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                {t.tools.dosingRecommendations}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map(result => (
                  <div key={result.fertilizerId} className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">{result.fertilizerName}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.tools.dailyDose}:</span>
                        <span className="font-medium">{result.dailyDose} {result.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t.tools.weeklyDose}:</span>
                        <span className="font-medium">{result.weeklyDose} {result.unit}</span>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="grid grid-cols-5 gap-1 text-xs text-center">
                      <div>
                        <div className="text-muted-foreground">N</div>
                        <div>{result.nutrients.nitrogen}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">P</div>
                        <div>{result.nutrients.phosphorus}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">K</div>
                        <div>{result.nutrients.potassium}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Fe</div>
                        <div>{result.nutrients.iron}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Mg</div>
                        <div>{result.nutrients.magnesium}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total summary */}
              <div className="mt-6 p-4 rounded-lg bg-primary/10">
                <h4 className="font-medium mb-3">{t.tools.weeklyTotal}</h4>
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground">N</div>
                    <div className="text-lg font-bold">{totalNutrients.nitrogen.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">ppm</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">P</div>
                    <div className="text-lg font-bold">{totalNutrients.phosphorus.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">ppm</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">K</div>
                    <div className="text-lg font-bold">{totalNutrients.potassium.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">ppm</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Fe</div>
                    <div className="text-lg font-bold">{totalNutrients.iron.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">ppm</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Mg</div>
                    <div className="text-lg font-bold">{totalNutrients.magnesium.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">ppm</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </PageWrapper>
    </Layout>
  );
};

export default DosageCalculator;