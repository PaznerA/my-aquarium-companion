import { useState, useEffect, useCallback } from 'react';
import { AppData, loadData, saveData, generateId } from '@/lib/storage';
import type { Aquarium, Fish, Plant, WaterParameter, Equipment, Fertilizer, DosingLog, Task } from '@/lib/storage';

export const useAppData = () => {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Aquariums
  const addAquarium = useCallback((aquarium: Omit<Aquarium, 'id' | 'dateCreated'>) => {
    const newAquarium: Aquarium = {
      ...aquarium,
      id: generateId(),
      dateCreated: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, aquariums: [...prev.aquariums, newAquarium] }));
    return newAquarium;
  }, []);

  const updateAquarium = useCallback((id: string, updates: Partial<Aquarium>) => {
    setData(prev => ({
      ...prev,
      aquariums: prev.aquariums.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
  }, []);

  const deleteAquarium = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      aquariums: prev.aquariums.filter(a => a.id !== id),
      fish: prev.fish.filter(f => f.aquariumId !== id),
      plants: prev.plants.filter(p => p.aquariumId !== id),
      waterParameters: prev.waterParameters.filter(w => w.aquariumId !== id),
      dosingLogs: prev.dosingLogs.filter(d => d.aquariumId !== id),
      tasks: prev.tasks.filter(t => t.aquariumId !== id),
    }));
  }, []);

  // Fish
  const addFish = useCallback((fish: Omit<Fish, 'id' | 'dateAdded'>) => {
    const newFish: Fish = {
      ...fish,
      id: generateId(),
      dateAdded: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, fish: [...prev.fish, newFish] }));
    return newFish;
  }, []);

  const deleteFish = useCallback((id: string) => {
    setData(prev => ({ ...prev, fish: prev.fish.filter(f => f.id !== id) }));
  }, []);

  // Plants
  const addPlant = useCallback((plant: Omit<Plant, 'id' | 'dateAdded'>) => {
    const newPlant: Plant = {
      ...plant,
      id: generateId(),
      dateAdded: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, plants: [...prev.plants, newPlant] }));
    return newPlant;
  }, []);

  const deletePlant = useCallback((id: string) => {
    setData(prev => ({ ...prev, plants: prev.plants.filter(p => p.id !== id) }));
  }, []);

  // Water Parameters
  const addWaterParameter = useCallback((param: Omit<WaterParameter, 'id'>) => {
    const newParam: WaterParameter = { ...param, id: generateId() };
    setData(prev => ({ ...prev, waterParameters: [...prev.waterParameters, newParam] }));
    return newParam;
  }, []);

  // Equipment
  const addEquipment = useCallback((equipment: Omit<Equipment, 'id'>) => {
    const newEquipment: Equipment = { ...equipment, id: generateId() };
    setData(prev => ({ ...prev, equipment: [...prev.equipment, newEquipment] }));
    return newEquipment;
  }, []);

  const deleteEquipment = useCallback((id: string) => {
    setData(prev => ({ ...prev, equipment: prev.equipment.filter(e => e.id !== id) }));
  }, []);

  // Fertilizers
  const addFertilizer = useCallback((fertilizer: Omit<Fertilizer, 'id'>) => {
    const newFertilizer: Fertilizer = { ...fertilizer, id: generateId() };
    setData(prev => ({ ...prev, fertilizers: [...prev.fertilizers, newFertilizer] }));
    return newFertilizer;
  }, []);

  const updateFertilizer = useCallback((id: string, updates: Partial<Fertilizer>) => {
    setData(prev => ({
      ...prev,
      fertilizers: prev.fertilizers.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  }, []);

  const deleteFertilizer = useCallback((id: string) => {
    setData(prev => ({ ...prev, fertilizers: prev.fertilizers.filter(f => f.id !== id) }));
  }, []);

  // Dosing Logs
  const addDosingLog = useCallback((log: Omit<DosingLog, 'id'>) => {
    const newLog: DosingLog = { ...log, id: generateId() };
    setData(prev => ({ ...prev, dosingLogs: [...prev.dosingLogs, newLog] }));
    return newLog;
  }, []);

  // Tasks
  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: generateId() };
    setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    return newTask;
  }, []);

  const toggleTask = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

  return {
    data,
    setData,
    // Aquariums
    addAquarium,
    updateAquarium,
    deleteAquarium,
    // Fish
    addFish,
    deleteFish,
    // Plants
    addPlant,
    deletePlant,
    // Water Parameters
    addWaterParameter,
    // Equipment
    addEquipment,
    deleteEquipment,
    // Fertilizers
    addFertilizer,
    updateFertilizer,
    deleteFertilizer,
    // Dosing
    addDosingLog,
    // Tasks
    addTask,
    toggleTask,
    deleteTask,
  };
};
