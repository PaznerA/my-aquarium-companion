// Domain hook for water sources and measurements
import { useCallback } from 'react';
import type { WaterSource, WaterSourceMeasurement, WaterParameter } from '@/types';
import { generateId } from '@/lib/storage';

export const useWaterSourceActions = (
  setData: React.Dispatch<React.SetStateAction<any>>,
  currentUserId: string,
  triggerSync: () => void
) => {
  // Water source actions
  const addWaterSource = useCallback((waterSource: Omit<WaterSource, 'id' | 'userId' | 'createdAt'>) => {
    const newWaterSource: WaterSource = {
      ...waterSource,
      id: generateId(),
      userId: currentUserId,
      createdAt: new Date().toISOString(),
    };
    setData((prev: any) => ({ ...prev, waterSources: [...prev.waterSources, newWaterSource] }));
    triggerSync();
    return newWaterSource;
  }, [currentUserId, triggerSync, setData]);

  const updateWaterSource = useCallback((id: string, updates: Partial<WaterSource>) => {
    setData((prev: any) => ({
      ...prev,
      waterSources: prev.waterSources.map((ws: WaterSource) => ws.id === id ? { ...ws, ...updates } : ws),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const deleteWaterSource = useCallback((id: string) => {
    setData((prev: any) => ({
      ...prev,
      waterSources: prev.waterSources.filter((ws: WaterSource) => ws.id !== id),
      waterSourceMeasurements: prev.waterSourceMeasurements.filter((m: WaterSourceMeasurement) => m.waterSourceId !== id),
      // Clear reference from aquariums
      aquariums: prev.aquariums.map((a: any) => a.waterSourceId === id ? { ...a, waterSourceId: undefined } : a),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  // Water source measurement actions
  const addWaterSourceMeasurement = useCallback((measurement: Omit<WaterSourceMeasurement, 'id' | 'userId'>) => {
    const newMeasurement: WaterSourceMeasurement = {
      ...measurement,
      id: generateId(),
      userId: currentUserId,
    };
    setData((prev: any) => ({ ...prev, waterSourceMeasurements: [...prev.waterSourceMeasurements, newMeasurement] }));
    triggerSync();
    return newMeasurement;
  }, [currentUserId, triggerSync, setData]);

  const updateWaterSourceMeasurement = useCallback((id: string, updates: Partial<WaterSourceMeasurement>) => {
    setData((prev: any) => ({
      ...prev,
      waterSourceMeasurements: prev.waterSourceMeasurements.map((m: WaterSourceMeasurement) => m.id === id ? { ...m, ...updates } : m),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const deleteWaterSourceMeasurement = useCallback((id: string) => {
    setData((prev: any) => ({ ...prev, waterSourceMeasurements: prev.waterSourceMeasurements.filter((m: WaterSourceMeasurement) => m.id !== id) }));
    triggerSync();
  }, [triggerSync, setData]);

  // Aquarium water parameter actions
  const addWaterParameter = useCallback((param: Omit<WaterParameter, 'id' | 'userId'>) => {
    const newParam: WaterParameter = { ...param, id: generateId(), userId: currentUserId };
    setData((prev: any) => ({ ...prev, waterParameters: [...prev.waterParameters, newParam] }));
    triggerSync();
    return newParam;
  }, [currentUserId, triggerSync, setData]);

  const deleteWaterParameter = useCallback((id: string) => {
    setData((prev: any) => ({ ...prev, waterParameters: prev.waterParameters.filter((w: WaterParameter) => w.id !== id) }));
    triggerSync();
  }, [triggerSync, setData]);

  return {
    addWaterSource,
    updateWaterSource,
    deleteWaterSource,
    addWaterSourceMeasurement,
    updateWaterSourceMeasurement,
    deleteWaterSourceMeasurement,
    addWaterParameter,
    deleteWaterParameter,
  };
};
