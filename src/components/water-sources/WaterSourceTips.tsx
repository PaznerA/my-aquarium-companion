import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import { 
  Lightbulb, Droplets, FlaskConical, Thermometer, 
  AlertCircle, CheckCircle2, Info
} from 'lucide-react';

export const WaterSourceTips = () => {
  const { language } = useI18n();

  const tips = language === 'cs' ? [
    {
      title: 'Pravidelné měření',
      icon: FlaskConical,
      content: 'Měřte parametry vstupní vody alespoň jednou měsíčně. Vodárny mohou měnit zdroje vody podle sezóny.',
      type: 'info',
    },
    {
      title: 'Dusičnany ve vstupní vodě',
      icon: AlertCircle,
      content: 'Pokud máte NO₃ ve vstupní vodě (často 5-20 mg/l), musíte to zohlednit při EI hnojení. Tyto dusičnany se přidávají při každé výměně vody.',
      type: 'warning',
    },
    {
      title: 'GH a KH pro rostliny',
      icon: Droplets,
      content: 'Pro většinu akvarijních rostlin je ideální GH 4-12°dH a KH 2-8°dH. Příliš měkká voda může způsobit nedostatek vápníku a hořčíku.',
      type: 'info',
    },
    {
      title: 'RO voda a remineralizace',
      icon: CheckCircle2,
      content: 'Pokud používáte RO vodu, nezapomeňte ji remineralizovat. Čistá RO voda nemá žádné minerály a může být nestabilní.',
      type: 'success',
    },
    {
      title: 'Sezónní změny',
      icon: Thermometer,
      content: 'Parametry vody se mohou měnit podle ročního období. V létě může být teplota vyšší a chlor silnější.',
      type: 'info',
    },
    {
      title: 'Draslík ve vstupní vodě',
      icon: Lightbulb,
      content: 'Většina vodovodní vody obsahuje 2-10 mg/l draslíku. To může snížit potřebu K hnojení, zejména u low-tech nádrží.',
      type: 'info',
    },
  ] : [
    {
      title: 'Regular Testing',
      icon: FlaskConical,
      content: 'Test your source water parameters at least monthly. Water utilities may change water sources seasonally.',
      type: 'info',
    },
    {
      title: 'Nitrates in Source Water',
      icon: AlertCircle,
      content: 'If your tap water contains NO₃ (often 5-20 mg/l), factor this into EI dosing. These nitrates are added with every water change.',
      type: 'warning',
    },
    {
      title: 'GH and KH for Plants',
      icon: Droplets,
      content: 'Most aquarium plants prefer GH 4-12°dH and KH 2-8°dH. Too soft water can cause calcium and magnesium deficiency.',
      type: 'info',
    },
    {
      title: 'RO Water Remineralization',
      icon: CheckCircle2,
      content: 'If using RO water, always remineralize it. Pure RO water has no minerals and can be unstable.',
      type: 'success',
    },
    {
      title: 'Seasonal Changes',
      icon: Thermometer,
      content: 'Water parameters can change with seasons. Summer water may be warmer with stronger chlorine.',
      type: 'info',
    },
    {
      title: 'Potassium in Tap Water',
      icon: Lightbulb,
      content: 'Most tap water contains 2-10 mg/l potassium. This can reduce K fertilization needs, especially in low-tech tanks.',
      type: 'info',
    },
  ];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'success':
        return 'border-green-500/30 bg-green-500/5';
      default:
        return 'border-primary/30 bg-primary/5';
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-amber-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5" />
            {language === 'cs' ? 'Proč sledovat vstupní vodu?' : 'Why Track Source Water?'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            {language === 'cs' 
              ? 'Znalost parametrů vstupní vody je klíčová pro správné hnojení metodou Estimative Index (EI). Dusičnany a draslík ve vstupní vodě ovlivňují celkovou bilanci živin.'
              : 'Knowing your source water parameters is crucial for proper Estimative Index (EI) dosing. Nitrates and potassium in source water affect the overall nutrient balance.'}
          </p>
          <p>
            {language === 'cs'
              ? 'Při každé výměně vody přidáváte nejen čerstvou vodu, ale i minerály, které obsahuje.'
              : 'With every water change, you add not just fresh water but also the minerals it contains.'}
          </p>
        </CardContent>
      </Card>

      {/* Tips Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {tips.map((tip, index) => (
          <Card key={index} className={`border-2 ${getTypeStyles(tip.type)}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <tip.icon className={`h-4 w-4 ${getIconStyles(tip.type)}`} />
                {tip.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {tip.content}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* EI Integration Note */}
      <Card className="border-2 border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FlaskConical className="h-4 w-4" />
            {language === 'cs' ? 'Integrace s EI výpočty' : 'EI Calculation Integration'}
            <Badge variant="secondary" className="text-xs">
              {language === 'cs' ? 'Připravujeme' : 'Coming Soon'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {language === 'cs'
            ? 'Brzy budou parametry vstupní vody automaticky zohledněny v kalkulátoru EI hnojení. Výpočty budou přesnější díky znalosti výchozích hodnot NO₃, K a dalších minerálů.'
            : 'Soon, source water parameters will be automatically factored into EI dosing calculations. Calculations will be more accurate with knowledge of baseline NO₃, K, and other minerals.'}
        </CardContent>
      </Card>
    </div>
  );
};
