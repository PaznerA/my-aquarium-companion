// Domain hook for events management
import { useCallback } from 'react';
import type { AquariumEvent } from '@/types';
import { generateId } from '@/lib/storage';

export const useEventActions = (
  setData: React.Dispatch<React.SetStateAction<any>>,
  currentUserId: string,
  triggerSync: () => void
) => {
  const addEvent = useCallback((event: Omit<AquariumEvent, 'id' | 'userId'>) => {
    const newEvent: AquariumEvent = { ...event, id: generateId(), userId: currentUserId };
    setData((prev: any) => ({ ...prev, events: [...prev.events, newEvent] }));
    triggerSync();
    return newEvent;
  }, [currentUserId, triggerSync, setData]);

  const updateEvent = useCallback((id: string, updates: Partial<AquariumEvent>) => {
    setData((prev: any) => ({
      ...prev,
      events: prev.events.map((e: AquariumEvent) => e.id === id ? { ...e, ...updates } : e),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const toggleEvent = useCallback((id: string) => {
    setData((prev: any) => ({
      ...prev,
      events: prev.events.map((e: AquariumEvent) => e.id === id ? { ...e, completed: !e.completed } : e),
    }));
    triggerSync();
  }, [triggerSync, setData]);

  const deleteEvent = useCallback((id: string) => {
    setData((prev: any) => ({ ...prev, events: prev.events.filter((e: AquariumEvent) => e.id !== id) }));
    triggerSync();
  }, [triggerSync, setData]);

  return {
    addEvent,
    updateEvent,
    toggleEvent,
    deleteEvent,
  };
};
