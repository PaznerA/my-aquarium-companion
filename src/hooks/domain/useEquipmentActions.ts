// Domain hook for equipment management
import { useCallback } from 'react';
import type { Equipment } from '@/types';
import { generateId } from '@/lib/storage';

export const useEquipmentActions = (
  setData: React.Dispatch<React.SetStateAction<any>>,
  currentUserId: string,
  triggerSync: () => void
) => {
  const addEquipment = useCallback((equipment: Omit<Equipment, 'id' | 'userId'>) => {
    const newEquipment: Equipment = { ...equipment, id: generateId(), userId: currentUserId };
    setData((prev: any) => ({ ...prev, equipment: [...prev.equipment, newEquipment] }));
    triggerSync();
    return newEquipment;
  }, [currentUserId, triggerSync, setData]);

  const updateEquipment = useCallback((id: string, updates: Partial<Equipment>) => {
    setData((prev: any) => ({
      ...prev,
      equipment: prev.equipment.map((e: Equipment) => e.id === id ? { ...e, ...updates } : e),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const deleteEquipment = useCallback((id: string) => {
    setData((prev: any) => ({ ...prev, equipment: prev.equipment.filter((e: Equipment) => e.id !== id) }));
    triggerSync();
  }, [triggerSync, setData]);

  return {
    addEquipment,
    updateEquipment,
    deleteEquipment,
  };
};
