import { useState } from 'react';
import { Plus, Leaf, Sun, Droplets, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useI18n } from '@/lib/i18n';
import type { User, PlantDensity, LightLevel, WaterSource } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddAquariumDialogProps {
  onAdd: (aquarium: { 
    name: string; 
    volume: number; 
    sharedWithAll?: boolean; 
    sharedWith?: string[];
    plantDensity?: PlantDensity;
    hasCO2?: boolean;
    lightLevel?: LightLevel;
    waterSourceId?: string;
  }) => void;
  users: User[];
  currentUserId: string | null;
  waterSources: WaterSource[];
}

export const AddAquariumDialog = ({ onAdd, users, currentUserId, waterSources }: AddAquariumDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [volume, setVolume] = useState('');
  const [sharedWithAll, setSharedWithAll] = useState(false);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  // EI parameters
  const [plantDensity, setPlantDensity] = useState<PlantDensity>('medium');
  const [hasCO2, setHasCO2] = useState(false);
  const [lightLevel, setLightLevel] = useState<LightLevel>('medium');
  const [waterSourceId, setWaterSourceId] = useState<string>('none');
  const { t, unitSystem, parseVolume, volumeUnit } = useI18n();

  const otherUsers = users.filter(u => u.id !== currentUserId);

  const handleUserToggle = (userId: string) => {
    setSharedWith(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && volume) {
      const volumeInLiters = parseVolume(parseFloat(volume));
      onAdd({ 
        name, 
        volume: volumeInLiters,
        sharedWithAll,
        sharedWith: sharedWithAll ? [] : sharedWith,
        plantDensity,
        hasCO2,
        lightLevel,
        waterSourceId: waterSourceId === 'none' ? undefined : waterSourceId,
      });
      setName('');
      setVolume('');
      setSharedWithAll(false);
      setSharedWith([]);
      setPlantDensity('medium');
      setHasCO2(false);
      setLightLevel('medium');
      setWaterSourceId('none');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t.dashboard.addAquarium}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.aquarium.newAquarium}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.inventory.name}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={unitSystem === 'metric' ? 'Např. Hlavní akvárium' : 'e.g. Main Tank'}
              className="border-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volume">{t.aquarium.volume} ({volumeUnit})</Label>
            <Input
              id="volume"
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder={unitSystem === 'metric' ? 'Např. 200' : 'e.g. 50'}
              className="border-2"
            />
          </div>

          {/* EI Parameters */}
          <div className="space-y-3 pt-2 border-t">
            <Label className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              {t.inventory.plantDensity}
            </Label>
            <Select value={plantDensity} onValueChange={(v) => setPlantDensity(v as PlantDensity)}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t.inventory.plantDensityLow}</SelectItem>
                <SelectItem value="medium">{t.inventory.plantDensityMedium}</SelectItem>
                <SelectItem value="high">{t.inventory.plantDensityHigh}</SelectItem>
                <SelectItem value="dutch">{t.inventory.plantDensityDutch}</SelectItem>
              </SelectContent>
            </Select>

            <Label className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              {t.inventory.lightLevel}
            </Label>
            <Select value={lightLevel} onValueChange={(v) => setLightLevel(v as LightLevel)}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t.inventory.lightLevelLow}</SelectItem>
                <SelectItem value="medium">{t.inventory.lightLevelMedium}</SelectItem>
                <SelectItem value="high">{t.inventory.lightLevelHigh}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between">
              <Label htmlFor="co2" className="flex items-center gap-2 cursor-pointer">
                <Droplets className="h-4 w-4" />
                {t.inventory.hasCO2}
              </Label>
              <Switch
                id="co2"
                checked={hasCO2}
                onCheckedChange={setHasCO2}
              />
            </div>

            {/* Water Source Selection */}
            {waterSources.length > 0 && (
              <>
                <Label className="flex items-center gap-2 pt-2">
                  <Droplet className="h-4 w-4" />
                  {t.aquarium.waterSource}
                </Label>
                <Select value={waterSourceId} onValueChange={setWaterSourceId}>
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder={t.aquarium.selectWaterSource} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t.aquarium.noWaterSource}</SelectItem>
                    {waterSources.map(source => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>

          {/* Sharing options */}
          {otherUsers.length > 0 && (
            <div className="space-y-3 pt-2 border-t">
              <Label>{t.aquarium.sharing}</Label>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="shareAll" 
                  checked={sharedWithAll}
                  onCheckedChange={(checked) => setSharedWithAll(checked === true)}
                />
                <Label htmlFor="shareAll" className="font-normal cursor-pointer">
                  {t.aquarium.shareWithAll}
                </Label>
              </div>
              {!sharedWithAll && (
                <div className="space-y-2 pl-6">
                  <Label className="text-sm text-muted-foreground">{t.aquarium.shareWithUsers}</Label>
                  {otherUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-2">
                      <Checkbox 
                        id={`share-${user.id}`}
                        checked={sharedWith.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                      />
                      <Label htmlFor={`share-${user.id}`} className="font-normal cursor-pointer">
                        {user.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full">
            {t.common.save}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
