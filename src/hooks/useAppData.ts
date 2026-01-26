import { useState, useEffect, useMemo } from 'react';
import { AppData, loadData, saveData } from '@/lib/storage';
import { useSyncTrigger } from './useSyncContext';

// Domain action hooks
import {
  useAquariumActions,
  useSpeciesActions,
  useFertilizerActions,
  useWaterSourceActions,
  useJournalActions,
  useEventActions,
  useEquipmentActions,
  useUserActions,
} from './domain';

/**
 * Main application data hook
 * Composes domain-specific action hooks for a clean API
 */
export const useAppData = () => {
  const [data, setData] = useState<AppData>(loadData);
  const { triggerSync } = useSyncTrigger();

  // Persist data on change
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Current user helper
  const currentUserId = data.currentUserId || data.users[0]?.id || '';

  // User-filtered data (memoized for performance)
  const filteredData = useMemo(() => ({
    aquariums: data.aquariums.filter(a => a.userId === currentUserId),
    fish: data.fish.filter(f => f.userId === currentUserId),
    plants: data.plants.filter(p => p.userId === currentUserId),
    waterParameters: data.waterParameters.filter(w => w.userId === currentUserId),
    equipment: data.equipment.filter(e => e.userId === currentUserId),
    fertilizers: data.fertilizers.filter(f => f.userId === currentUserId),
    dosingLogs: data.dosingLogs.filter(d => d.userId === currentUserId),
    events: data.events.filter(e => e.userId === currentUserId),
    journalEntries: data.journalEntries.filter(j => j.userId === currentUserId),
    diaryNotes: data.diaryNotes.filter(n => n.userId === currentUserId),
    waterSources: data.waterSources.filter(ws => ws.userId === currentUserId),
    waterSourceMeasurements: data.waterSourceMeasurements.filter(m => m.userId === currentUserId),
    users: data.users,
    currentUserId,
  }), [data, currentUserId]);

  // Compose domain actions
  const userActions = useUserActions(setData, triggerSync);
  const aquariumActions = useAquariumActions(setData, currentUserId, triggerSync);
  const speciesActions = useSpeciesActions(setData, currentUserId, triggerSync);
  const fertilizerActions = useFertilizerActions(setData, currentUserId, triggerSync);
  const waterSourceActions = useWaterSourceActions(setData, currentUserId, triggerSync);
  const journalActions = useJournalActions(data, setData, currentUserId, triggerSync);
  const eventActions = useEventActions(setData, currentUserId, triggerSync);
  const equipmentActions = useEquipmentActions(setData, currentUserId, triggerSync);

  return {
    // Data
    data: filteredData,
    rawData: data,
    setData,
    currentUserId,
    
    // User actions
    ...userActions,
    
    // Aquarium actions
    ...aquariumActions,
    
    // Species actions (fish & plants)
    ...speciesActions,
    
    // Fertilizer & dosing actions
    ...fertilizerActions,
    
    // Water source actions
    ...waterSourceActions,
    
    // Journal & diary actions
    ...journalActions,
    
    // Event actions
    ...eventActions,
    
    // Equipment actions
    ...equipmentActions,
  };
};
