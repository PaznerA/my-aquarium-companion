import { useState } from 'react';
import { UserPlus, Users, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { User } from '@/lib/storage';

interface UserSwitcherProps {
  users: User[];
  currentUserId: string;
  onSwitch: (userId: string) => void;
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const UserSwitcher = ({
  users,
  currentUserId,
  onSwitch,
  onAdd,
  onUpdate,
  onDelete,
}: UserSwitcherProps) => {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName('');
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditName(user.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdate(editingId, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h2 className="font-bold">Uživatelé</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Spravujte více profilů pro sdílené zařízení
      </p>

      {/* User List */}
      <div className="space-y-2">
        {users.map(user => (
          <div
            key={user.id}
            className={`flex items-center gap-3 p-3 rounded theme-border transition-colors ${
              user.id === currentUserId
                ? 'border-primary bg-primary/5'
                : 'hover:border-primary/50 cursor-pointer'
            }`}
            onClick={() => !editingId && user.id !== currentUserId && onSwitch(user.id)}
          >
            {editingId === user.id ? (
              <>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                />
                <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); saveEdit(); }}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); cancelEdit(); }}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{user.name}</span>
                {user.id === currentUserId && (
                  <span className="text-xs text-primary font-bold">AKTIVNÍ</span>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => { e.stopPropagation(); startEdit(user); }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                {users.length > 1 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Smazat uživatele?</DialogTitle>
                      </DialogHeader>
                      <p className="text-muted-foreground">
                        Tato akce smaže uživatele "{user.name}" a všechna jeho data. 
                        Akce je nevratná.
                      </p>
                      <div className="flex gap-3 justify-end mt-4">
                        <Button variant="outline">Zrušit</Button>
                        <Button variant="destructive" onClick={() => onDelete(user.id)}>
                          Smazat
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add New User */}
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Jméno nového uživatele"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Přidat
        </Button>
      </div>
    </Card>
  );
};
