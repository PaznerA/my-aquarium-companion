import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHeader, EmptyState, PageWrapper } from '@/components/common';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EventCard } from '@/components/events/EventCard';
import { AddEventDialog } from '@/components/forms/AddEventDialog';
import { EditEventDialog } from '@/components/forms/EditEventDialog';
import { useAppDataContext } from '@/contexts';
import { useI18n } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CalendarDays, History, Clock, Settings2 } from 'lucide-react';
import type { AquariumEvent } from '@/lib/storage';

const Events = () => {
  const { data, addEvent, updateEvent, toggleEvent, deleteEvent } = useAppDataContext();
  const { t } = useI18n();
  const [editingEvent, setEditingEvent] = useState<AquariumEvent | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedEvents = [...data.events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

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
      <PageWrapper className="space-y-8">
        <PageHeader
          title={t.events.title}
          subtitle={t.events.subtitle}
          actions={
            <>
              <AddEventDialog aquariums={data.aquariums} onAdd={addEvent} />
              <ThemeToggle />
            </>
          }
        />

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
              <EmptyState
                icon={CalendarDays}
                title={t.events.noUpcoming}
                description={t.events.noUpcomingHint}
                variant="card"
              />
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
              <EmptyState
                icon={History}
                title={t.events.noPast}
                variant="card"
              />
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
            <Card className="p-4 border-2 bg-muted/50">
              <p className="text-sm text-muted-foreground">{t.events.recurringHint}</p>
            </Card>
            {recurringEvents.length === 0 ? (
              <EmptyState
                icon={Settings2}
                title={t.events.noRecurringEvents}
                description={t.events.noRecurringHint}
                variant="card"
              />
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
      </PageWrapper>
    </Layout>
  );
};

export default Events;
