// Domain hook for fertilizer and dosing management
import { useCallback } from 'react';
import type { Fertilizer, DosingLog } from '@/types';
import { generateId } from '@/lib/storage';

export const useFertilizerActions = (
  setData: React.Dispatch<React.SetStateAction<any>>,
  currentUserId: string,
  triggerSync: () => void
) => {
  // Fertilizer actions
  const addFertilizer = useCallback((fertilizer: Omit<Fertilizer, 'id' | 'userId'>) => {
    const newFertilizer: Fertilizer = { ...fertilizer, id: generateId(), userId: currentUserId };
    setData((prev: any) => ({ ...prev, fertilizers: [...prev.fertilizers, newFertilizer] }));
    triggerSync();
    return newFertilizer;
  }, [currentUserId, triggerSync, setData]);

  const updateFertilizer = useCallback((id: string, updates: Partial<Fertilizer>) => {
    setData((prev: any) => ({
      ...prev,
      fertilizers: prev.fertilizers.map((f: Fertilizer) => f.id === id ? { ...f, ...updates } : f),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const deleteFertilizer = useCallback((id: string) => {
    setData((prev: any) => ({ ...prev, fertilizers: prev.fertilizers.filter((f: Fertilizer) => f.id !== id) }));
    triggerSync();
  }, [triggerSync, setData]);

  // Dosing log actions
  const addDosingLog = useCallback((log: Omit<DosingLog, 'id' | 'userId'>) => {
    const newLog: DosingLog = { ...log, id: generateId(), userId: currentUserId };
    setData((prev: any) => ({ ...prev, dosingLogs: [...prev.dosingLogs, newLog] }));
    triggerSync();
    return newLog;
  }, [currentUserId, triggerSync, setData]);

  return {
    addFertilizer,
    updateFertilizer,
    deleteFertilizer,
    addDosingLog,
  };
};
