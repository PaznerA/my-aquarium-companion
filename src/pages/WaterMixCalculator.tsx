import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageWrapper, PageHeader } from '@/components/common';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Scale, Calculator, RotateCcw, Droplet, Target, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface WaterSource {
  gh: number;
  kh: number;
}

interface MixResult {
  roPercent: number;
  tapPercent: number;
  resultGh: number;
  resultKh: number;
  roLiters: number;
  tapLiters: number;
}

const WaterMixCalculator = () => {
  const { t } = useI18n();

  // Water sources
  const [tapWater, setTapWater] = useState<WaterSource>({ gh: 15, kh: 10 });
  const [roWater, setRoWater] = useState<WaterSource>({ gh: 0, kh: 0 });
  
  // Target parameters
  const [targetGh, setTargetGh] = useState(6);
  const [targetKh, setTargetKh] = useState(4);
  
  // Total volume needed
  const [totalVolume, setTotalVolume] = useState(50);

  // Mode: calculate mix for GH, KH, or both (use average)
  const [mode, setMode] = useState<'gh' | 'kh' | 'balanced'>('balanced');

  // Results
  const [result, setResult] = useState<MixResult | null>(null);

  // Calculate mix ratio
  const calculateMix = () => {
    // Linear interpolation: result = ro * roPercent + tap * tapPercent
    // roPercent + tapPercent = 1
    // For target: target = ro * p + tap * (1-p)
    // p = (tap - target) / (tap - ro)

    const calculateRatio = (target: number, tap: number, ro: number): number => {
      if (tap === ro) return 0.5; // Avoid division by zero
      const ratio = (tap - target) / (tap - ro);
      return Math.max(0, Math.min(1, ratio)); // Clamp 0-1
    };

    let roPercent: number;
    
    if (mode === 'gh') {
      roPercent = calculateRatio(targetGh, tapWater.gh, roWater.gh);
    } else if (mode === 'kh') {
      roPercent = calculateRatio(targetKh, tapWater.kh, roWater.kh);
    } else {
      // Balanced: average of both ratios
      const ghRatio = calculateRatio(targetGh, tapWater.gh, roWater.gh);
      const khRatio = calculateRatio(targetKh, tapWater.kh, roWater.kh);
      roPercent = (ghRatio + khRatio) / 2;
    }

    const tapPercent = 1 - roPercent;
    
    // Calculate resulting water parameters
    const resultGh = roWater.gh * roPercent + tapWater.gh * tapPercent;
    const resultKh = roWater.kh * roPercent + tapWater.kh * tapPercent;

    // Calculate liters
    const roLiters = Math.round(totalVolume * roPercent * 10) / 10;
    const tapLiters = Math.round(totalVolume * tapPercent * 10) / 10;

    setResult({
      roPercent: Math.round(roPercent * 100),
      tapPercent: Math.round(tapPercent * 100),
      resultGh: Math.round(resultGh * 10) / 10,
      resultKh: Math.round(resultKh * 10) / 10,
      roLiters,
      tapLiters,
    });

    toast.success(t.tools.calculationComplete);
  };

  const handleReset = () => {
    setTapWater({ gh: 15, kh: 10 });
    setRoWater({ gh: 0, kh: 0 });
    setTargetGh(6);
    setTargetKh(4);
    setTotalVolume(50);
    setMode('balanced');
    setResult(null);
  };

  // Quick preset targets
  const presets = [
    { name: t.tools.presetSoftWater, gh: 4, kh: 2 },
    { name: t.tools.presetMediumWater, gh: 8, kh: 5 },
    { name: t.tools.presetShrimp, gh: 6, kh: 3 },
    { name: t.tools.presetDiscus, gh: 3, kh: 1 },
  ];

  // Calculate if targets are achievable
  const isAchievable = useMemo(() => {
    const ghAchievable = targetGh >= Math.min(roWater.gh, tapWater.gh) && 
                         targetGh <= Math.max(roWater.gh, tapWater.gh);
    const khAchievable = targetKh >= Math.min(roWater.kh, tapWater.kh) && 
                         targetKh <= Math.max(roWater.kh, tapWater.kh);
    return { gh: ghAchievable, kh: khAchievable, both: ghAchievable && khAchievable };
  }, [targetGh, targetKh, roWater, tapWater]);

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
            title={t.tools.waterMixCalculator} 
            subtitle={t.tools.waterMixCalculatorLongDesc}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Water Sources Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5" />
                {t.tools.waterSources}
              </CardTitle>
              <CardDescription>
                {t.tools.waterSourcesDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tap Water */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  🚿 {t.tools.tapWater}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GH (°dH)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={tapWater.gh}
                      onChange={(e) => setTapWater(prev => ({ ...prev, gh: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>KH (°dH)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      value={tapWater.kh}
                      onChange={(e) => setTapWater(prev => ({ ...prev, kh: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* RO Water */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  💧 {t.tools.roWater}
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      {t.tools.roWaterTooltip}
                    </TooltipContent>
                  </Tooltip>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GH (°dH)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      value={roWater.gh}
                      onChange={(e) => setRoWater(prev => ({ ...prev, gh: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>KH (°dH)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      value={roWater.kh}
                      onChange={(e) => setRoWater(prev => ({ ...prev, kh: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Total Volume */}
              <div className="space-y-2">
                <Label>{t.tools.totalVolume}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={totalVolume}
                    onChange={(e) => setTotalVolume(parseInt(e.target.value) || 1)}
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {t.aquarium.liters}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t.tools.targetParams}
              </CardTitle>
              <CardDescription>
                {t.tools.targetParamsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Presets */}
              <div className="space-y-2">
                <Label>{t.tools.presets}</Label>
                <div className="flex flex-wrap gap-2">
                  {presets.map(preset => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTargetGh(preset.gh);
                        setTargetKh(preset.kh);
                      }}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Target GH */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t.tools.targetGh}</Label>
                  <Badge variant={isAchievable.gh ? 'secondary' : 'destructive'}>
                    {targetGh} °dH
                  </Badge>
                </div>
                <Slider
                  value={[targetGh]}
                  onValueChange={([v]) => setTargetGh(v)}
                  min={0}
                  max={20}
                  step={0.5}
                />
                {!isAchievable.gh && (
                  <p className="text-xs text-destructive">{t.tools.targetNotAchievable}</p>
                )}
              </div>

              {/* Target KH */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t.tools.targetKh}</Label>
                  <Badge variant={isAchievable.kh ? 'secondary' : 'destructive'}>
                    {targetKh} °dH
                  </Badge>
                </div>
                <Slider
                  value={[targetKh]}
                  onValueChange={([v]) => setTargetKh(v)}
                  min={0}
                  max={15}
                  step={0.5}
                />
                {!isAchievable.kh && (
                  <p className="text-xs text-destructive">{t.tools.targetNotAchievable}</p>
                )}
              </div>

              <Separator />

              {/* Mode */}
              <div className="space-y-2">
                <Label>{t.tools.optimizeFor}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={mode === 'gh' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('gh')}
                  >
                    GH
                  </Button>
                  <Button
                    variant={mode === 'kh' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('kh')}
                  >
                    KH
                  </Button>
                  <Button
                    variant={mode === 'balanced' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('balanced')}
                  >
                    {t.tools.balanced}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{t.tools.optimizeForDesc}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                onClick={calculateMix} 
                className="flex-1"
                disabled={!isAchievable.both && mode === 'balanced'}
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
        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                {t.tools.mixResult}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Mix Ratio */}
                <div className="space-y-4">
                  <h4 className="font-medium">{t.tools.mixRatio}</h4>
                  
                  {/* Visual ratio bar */}
                  <div className="h-8 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${result.roPercent}%` }}
                    >
                      {result.roPercent > 15 && `${result.roPercent}%`}
                    </div>
                    <div 
                      className="bg-amber-500 flex items-center justify-center text-white text-sm font-medium"
                      style={{ width: `${result.tapPercent}%` }}
                    >
                      {result.tapPercent > 15 && `${result.tapPercent}%`}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-blue-500/10 text-center">
                      <p className="text-sm text-muted-foreground">💧 {t.tools.roWater}</p>
                      <p className="text-2xl font-bold text-blue-600">{result.roLiters}L</p>
                      <p className="text-sm text-muted-foreground">({result.roPercent}%)</p>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-500/10 text-center">
                      <p className="text-sm text-muted-foreground">🚿 {t.tools.tapWater}</p>
                      <p className="text-2xl font-bold text-amber-600">{result.tapLiters}L</p>
                      <p className="text-sm text-muted-foreground">({result.tapPercent}%)</p>
                    </div>
                  </div>
                </div>

                {/* Resulting Parameters */}
                <div className="space-y-4">
                  <h4 className="font-medium">{t.tools.resultingParams}</h4>
                  
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <span>GH</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={Math.abs(result.resultGh - targetGh) < 0.5 ? 'default' : 'secondary'}>
                            {result.resultGh} °dH
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({t.tools.target}: {targetGh})
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (result.resultGh / 20) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <span>KH</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={Math.abs(result.resultKh - targetKh) < 0.5 ? 'default' : 'secondary'}>
                            {result.resultKh} °dH
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({t.tools.target}: {targetKh})
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (result.resultKh / 15) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">{t.tools.waterMixInfo}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-muted-foreground">
            <p>{t.tools.waterMixInfoDesc}</p>
            <ul className="mt-2 space-y-1">
              <li>{t.tools.waterMixTip1}</li>
              <li>{t.tools.waterMixTip2}</li>
              <li>{t.tools.waterMixTip3}</li>
            </ul>
          </CardContent>
        </Card>
      </PageWrapper>
    </Layout>
  );
};

export default WaterMixCalculator;