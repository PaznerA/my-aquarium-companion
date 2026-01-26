// Domain hook for species management (fish and plants)
import { useCallback } from 'react';
import type { Fish, Plant } from '@/types';
import { generateId } from '@/lib/storage';

export const useSpeciesActions = (
  setData: React.Dispatch<React.SetStateAction<any>>,
  currentUserId: string,
  triggerSync: () => void
) => {
  // Fish actions
  const addFish = useCallback((fish: Omit<Fish, 'id' | 'dateAdded' | 'userId'>) => {
    const newFish: Fish = {
      ...fish,
      id: generateId(),
      dateAdded: new Date().toISOString(),
      userId: currentUserId,
    };
    setData((prev: any) => ({ ...prev, fish: [...prev.fish, newFish] }));
    triggerSync();
    return newFish;
  }, [currentUserId, triggerSync, setData]);

  const updateFish = useCallback((id: string, updates: Partial<Fish>) => {
    setData((prev: any) => ({
      ...prev,
      fish: prev.fish.map((f: Fish) => f.id === id ? { ...f, ...updates } : f),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const deleteFish = useCallback((id: string) => {
    setData((prev: any) => ({ ...prev, fish: prev.fish.filter((f: Fish) => f.id !== id) }));
    triggerSync();
  }, [triggerSync, setData]);

  // Plant actions
  const addPlant = useCallback((plant: Omit<Plant, 'id' | 'dateAdded' | 'userId'>) => {
    const newPlant: Plant = {
      ...plant,
      id: generateId(),
      dateAdded: new Date().toISOString(),
      userId: currentUserId,
    };
    setData((prev: any) => ({ ...prev, plants: [...prev.plants, newPlant] }));
    triggerSync();
    return newPlant;
  }, [currentUserId, triggerSync, setData]);

  const updatePlant = useCallback((id: string, updates: Partial<Plant>) => {
    setData((prev: any) => ({
      ...prev,
      plants: prev.plants.map((p: Plant) => p.id === id ? { ...p, ...updates } : p),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const deletePlant = useCallback((id: string) => {
    setData((prev: any) => ({ ...prev, plants: prev.plants.filter((p: Plant) => p.id !== id) }));
    triggerSync();
  }, [triggerSync, setData]);

  return {
    addFish,
    updateFish,
    deleteFish,
    addPlant,
    updatePlant,
    deletePlant,
  };
};
