import { useState, useEffect } from 'react';
import { Pencil, Users, Globe, UserCheck, Leaf, Sun, Droplets, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useI18n } from '@/lib/i18n';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { Aquarium, User, PlantDensity, LightLevel, WaterSource } from '@/lib/storage';

interface EditAquariumDialogProps {
  aquarium: Aquarium;
  users: User[];
  waterSources: WaterSource[];
  onUpdate: (id: string, updates: Partial<Aquarium>) => void;
  trigger?: React.ReactNode;
}

export const EditAquariumDialog = ({ aquarium, users, waterSources, onUpdate, trigger }: EditAquariumDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(aquarium.name);
  const [volume, setVolume] = useState(aquarium.volume.toString());
  const [shareMode, setShareMode] = useState<'private' | 'all' | 'selected'>(
    aquarium.sharedWithAll ? 'all' : (aquarium.sharedWith?.length ? 'selected' : 'private')
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>(aquarium.sharedWith || []);
  // EI parameters
  const [plantDensity, setPlantDensity] = useState<PlantDensity>(aquarium.plantDensity || 'medium');
  const [hasCO2, setHasCO2] = useState(aquarium.hasCO2 ?? false);
  const [lightLevel, setLightLevel] = useState<LightLevel>(aquarium.lightLevel || 'medium');
  const [waterSourceId, setWaterSourceId] = useState<string>(aquarium.waterSourceId || '');
  const { t, unitSystem, parseVolume, volumeUnit } = useI18n();

  useEffect(() => {
    if (open) {
      setName(aquarium.name);
      // Convert liters to display unit
      if (unitSystem === 'imperial') {
        setVolume((aquarium.volume * 0.264172).toFixed(1));
      } else {
        setVolume(aquarium.volume.toString());
      }
      setShareMode(aquarium.sharedWithAll ? 'all' : (aquarium.sharedWith?.length ? 'selected' : 'private'));
      setSelectedUsers(aquarium.sharedWith || []);
      setPlantDensity(aquarium.plantDensity || 'medium');
      setHasCO2(aquarium.hasCO2 ?? false);
      setLightLevel(aquarium.lightLevel || 'medium');
      setWaterSourceId(aquarium.waterSourceId || '');
    }
  }, [open, aquarium, unitSystem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && volume) {
      const volumeInLiters = parseVolume(parseFloat(volume));
      onUpdate(aquarium.id, { 
        name, 
        volume: volumeInLiters,
        sharedWithAll: shareMode === 'all',
        sharedWith: shareMode === 'selected' ? selectedUsers : [],
        plantDensity,
        hasCO2,
        lightLevel,
        waterSourceId: waterSourceId || undefined,
      });
      setOpen(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const otherUsers = users.filter(u => u.id !== aquarium.userId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="border-2 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.aquarium.editAquarium}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.inventory.name}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              className="border-2"
            />
          </div>

          {/* EI Parameters */}
          <div className="space-y-3 pt-2 border-t border-border">
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
                    <SelectItem value="">{t.aquarium.noWaterSource}</SelectItem>
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
            <div className="space-y-3 pt-2 border-t border-border">
              <Label>{t.aquarium.sharing}</Label>
              <Select value={shareMode} onValueChange={(v) => setShareMode(v as typeof shareMode)}>
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      {t.aquarium.privateOnly}
                    </div>
                  </SelectItem>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {t.aquarium.shareWithAll}
                    </div>
                  </SelectItem>
                  <SelectItem value="selected">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t.aquarium.shareWithSelected}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {shareMode === 'selected' && (
                <div className="space-y-2 pl-2">
                  {otherUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                      <label htmlFor={`user-${user.id}`} className="text-sm cursor-pointer">
                        {user.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1 border-2" onClick={() => setOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" className="flex-1">
              {t.common.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
