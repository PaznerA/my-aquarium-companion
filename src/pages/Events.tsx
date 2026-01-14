import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EventCard } from '@/components/events/EventCard';
import { AddEventDialog } from '@/components/forms/AddEventDialog';
import { EditEventDialog } from '@/components/forms/EditEventDialog';
import { useAppData } from '@/hooks/useAppData';
import { useI18n } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CalendarDays, History, Clock, Settings2 } from 'lucide-react';
import type { AquariumEvent } from '@/lib/storage';

const Events = () => {
  const { data, addEvent, updateEvent, toggleEvent, deleteEvent } = useAppData();
  const { t } = useI18n();
  const [editingEvent, setEditingEvent] = useState<AquariumEvent | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort events by date
  const sortedEvents = [...data.events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Categorize events
  const upcomingEvents = sortedEvents.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= today && !e.completed;
  });

  const pastEvents = sortedEvents.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate < today || e.completed;
  }).reverse();

  const recurringEvents = sortedEvents.filter(e => e.recurring);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.events.title}</h1>
            <p className="text-muted-foreground">{t.events.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <AddEventDialog aquariums={data.aquariums} onAdd={addEvent} />
            <ThemeToggle />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">{t.events.upcoming}</span>
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">{t.events.past}</span>
            </TabsTrigger>
            <TabsTrigger value="recurring" className="gap-2">
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t.events.recurringSettings}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <Card className="p-8 text-center theme-empty">
                <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t.events.noUpcoming}</p>
                <p className="text-sm text-muted-foreground">{t.events.noUpcomingHint}</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    aquariumName={data.aquariums.find(a => a.id === event.aquariumId)?.name}
                    onToggle={() => toggleEvent(event.id)}
                    onEdit={() => setEditingEvent(event)}
                    onDelete={() => deleteEvent(event.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastEvents.length === 0 ? (
              <Card className="p-8 text-center theme-empty">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t.events.noPast}</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    aquariumName={data.aquariums.find(a => a.id === event.aquariumId)?.name}
                    onToggle={() => toggleEvent(event.id)}
                    onEdit={() => setEditingEvent(event)}
                    onDelete={() => deleteEvent(event.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recurring" className="space-y-4">
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">{t.events.recurringHint}</p>
            </Card>
            {recurringEvents.length === 0 ? (
              <Card className="p-8 text-center theme-empty">
                <Settings2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t.events.noRecurringEvents}</p>
                <p className="text-sm text-muted-foreground">{t.events.noRecurringHint}</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {recurringEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    aquariumName={data.aquariums.find(a => a.id === event.aquariumId)?.name}
                    onToggle={() => toggleEvent(event.id)}
                    onEdit={() => setEditingEvent(event)}
                    onDelete={() => deleteEvent(event.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editingEvent && (
          <EditEventDialog
            event={editingEvent}
            aquariums={data.aquariums}
            onUpdate={(id, updates) => {
              updateEvent(id, updates);
              setEditingEvent(null);
            }}
            trigger={<span className="hidden" />}
          />
        )}
      </div>
    </Layout>
  );
};

export default Events;
