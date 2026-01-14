import { useTheme } from '@/hooks/useTheme';
import { themes, ThemeId, themeIds } from '@/themes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Palette, 
  Sun, 
  Moon, 
  Image as ImageIcon,
  Check,
  Sparkles,
  Square,
  Leaf,
  Layers,
  PartyPopper
} from 'lucide-react';
import { cn } from '@/lib/utils';

const themeIcons: Record<ThemeId, React.ReactNode> = {
  brutalist: <Square className="h-4 w-4" />,
  'fresh-modern': <Leaf className="h-4 w-4" />,
  glassmorphism: <Layers className="h-4 w-4" />,
  retro: <PartyPopper className="h-4 w-4" />,
};

export const ThemeSelector = () => {
  const { 
    themeId, 
    mode, 
    backgroundImage,
    themeConfig,
    setThemeId, 
    toggleMode,
    setBackgroundImage 
  } = useTheme();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-6 border-2 space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="h-5 w-5 text-primary" />
        <div>
          <h2 className="font-bold">Vzhled aplikace</h2>
          <p className="text-sm text-muted-foreground">
            Vyberte téma a režim zobrazení
          </p>
        </div>
      </div>

      {/* Theme selection grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {themeIds.map((id) => {
          const config = themes[id];
          const isActive = themeId === id;
          
          return (
            <button
              key={id}
              onClick={() => setThemeId(id)}
              className={cn(
                "relative p-4 rounded-lg border-2 text-left transition-all",
                "hover:border-primary/50 hover:shadow-sm",
                isActive 
                  ? "border-primary bg-primary/5" 
                  : "border-border bg-card"
              )}
            >
              {isActive && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                {themeIcons[id]}
                <span className="font-medium">{config.name}</span>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {config.description}
              </p>
              
              {/* Color preview */}
              <div className="flex gap-1">
                <div 
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: config.preview.primary }}
                />
                <div 
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: config.preview.secondary }}
                />
                <div 
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: config.preview.accent }}
                />
              </div>
              
              {/* Feature badges */}
              {config.features.hasGlassEffect && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Glass efekt
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Dark/Light mode toggle */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          {mode === 'light' ? (
            <Sun className="h-4 w-4 text-amber-500" />
          ) : (
            <Moon className="h-4 w-4 text-blue-400" />
          )}
          <Label htmlFor="dark-mode" className="text-sm font-medium">
            {mode === 'light' ? 'Světlý režim' : 'Tmavý režim'}
          </Label>
        </div>
        <Switch
          id="dark-mode"
          checked={mode === 'dark'}
          onCheckedChange={toggleMode}
        />
      </div>

      {/* Background image for glassmorphism */}
      {themeConfig.features.hasBackgroundImage && (
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Obrázek pozadí</Label>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1"
            />
            {backgroundImage && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setBackgroundImage(null)}
              >
                Odebrat
              </Button>
            )}
          </div>
          
          {backgroundImage && (
            <div className="relative w-full h-20 rounded-md overflow-hidden border">
              <img 
                src={backgroundImage} 
                alt="Background preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Nahrajte obrázek pro pozadí s průhledným glass efektem
          </p>
        </div>
      )}
    </Card>
  );
};
