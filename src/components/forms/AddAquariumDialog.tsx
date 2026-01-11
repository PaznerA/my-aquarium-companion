import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useI18n } from '@/lib/i18n';
import { User } from '@/lib/storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AddAquariumDialogProps {
  onAdd: (aquarium: { name: string; volume: number; sharedWithAll?: boolean; sharedWith?: string[] }) => void;
  users: User[];
  currentUserId: string | null;
}

export const AddAquariumDialog = ({ onAdd, users, currentUserId }: AddAquariumDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [volume, setVolume] = useState('');
  const [sharedWithAll, setSharedWithAll] = useState(false);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
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
      });
      setName('');
      setVolume('');
      setSharedWithAll(false);
      setSharedWith([]);
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
      <DialogContent className="border-2">
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
