// Domain hook for user management
import { useCallback } from 'react';
import type { User, AppData } from '@/types';
import { generateId } from '@/lib/storage';

export const useUserActions = (
  setData: React.Dispatch<React.SetStateAction<AppData>>,
  triggerSync: () => void
) => {
  const addUser = useCallback((name: string) => {
    const newUser: User = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ 
      ...prev, 
      users: [...prev.users, newUser],
      currentUserId: newUser.id,
    }));
    triggerSync();
    return newUser;
  }, [triggerSync, setData]);

  const switchUser = useCallback((userId: string) => {
    setData(prev => ({ ...prev, currentUserId: userId }));
    triggerSync();
  }, [triggerSync, setData]);

  const updateUser = useCallback((id: string, name: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, name } : u),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const deleteUser = useCallback((id: string) => {
    setData(prev => {
      const remaining = prev.users.filter(u => u.id !== id);
      return {
        ...prev,
        users: remaining,
        currentUserId: remaining[0]?.id || null,
        aquariums: prev.aquariums.filter(a => a.userId !== id),
        fish: prev.fish.filter(f => f.userId !== id),
        plants: prev.plants.filter(p => p.userId !== id),
        waterParameters: prev.waterParameters.filter(w => w.userId !== id),
        equipment: prev.equipment.filter(e => e.userId !== id),
        fertilizers: prev.fertilizers.filter(f => f.userId !== id),
        dosingLogs: prev.dosingLogs.filter(d => d.userId !== id),
        events: prev.events.filter(e => e.userId !== id),
        journalEntries: prev.journalEntries.filter(j => j.userId !== id),
        diaryNotes: prev.diaryNotes.filter(n => n.userId !== id),
        waterSources: prev.waterSources.filter(ws => ws.userId !== id),
        waterSourceMeasurements: prev.waterSourceMeasurements.filter(m => m.userId !== id),
      };
    });
    triggerSync();
  }, [triggerSync, setData]);

  return {
    addUser,
    switchUser,
    updateUser,
    deleteUser,
  };
};
