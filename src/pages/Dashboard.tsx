import { Layout } from '@/components/layout/Layout';
import { PageHeader, SectionHeader, EmptyState, PageWrapper } from '@/components/common';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { AquariumCard } from '@/components/dashboard/AquariumCard';
import { EventCard } from '@/components/events/EventCard';
import { EventCalendar } from '@/components/dashboard/EventCalendar';
import { AddAquariumDialog } from '@/components/forms/AddAquariumDialog';
import { AddEventDialog } from '@/components/forms/AddEventDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAppData } from '@/hooks/useAppData';
import { useI18n } from '@/lib/i18n';
import { isSameDay, isAfter, isBefore, addDays, endOfWeek, endOfMonth, startOfDay } from 'date-fns';

const Dashboard = () => {
  const {
    data,
    rawData,
    currentUserId,
    addAquarium,
    addEvent,
    toggleEvent,
    deleteEvent,
  } = useAppData();
  const { t, language } = useI18n();

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const monthEnd = endOfMonth(today);

  const upcomingEvents = data.events
    .filter(e => !e.completed && new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayEvents = upcomingEvents.filter(e => isSameDay(new Date(e.date), today));
  const tomorrowEvents = upcomingEvents.filter(e => isSameDay(new Date(e.date), tomorrow));
  const thisWeekEvents = upcomingEvents.filter(e => {
    const eventDate = new Date(e.date);
    return isAfter(eventDate, tomorrow) && (isBefore(eventDate, weekEnd) || isSameDay(eventDate, weekEnd));
  });
  const thisMonthEvents = upcomingEvents.filter(e => {
    const eventDate = new Date(e.date);
    return isAfter(eventDate, weekEnd) && (isBefore(eventDate, monthEnd) || isSameDay(eventDate, monthEnd));
  });

  const eventGroups = [
    { label: language === 'cs' ? 'Dnes' : 'Today', events: todayEvents },
    { label: language === 'cs' ? 'Zítra' : 'Tomorrow', events: tomorrowEvents },
    { label: language === 'cs' ? 'Tento týden' : 'This week', events: thisWeekEvents },
    { label: language === 'cs' ? 'Tento měsíc' : 'This month', events: thisMonthEvents },
  ].filter(g => g.events.length > 0);

  return (
    <Layout>
      <PageWrapper className="space-y-8">
        <PageHeader
          title={t.dashboard.title}
          subtitle={t.dashboard.subtitle}
          actions={<ThemeToggle />}
        />

        <QuickStats data={data} />

        <EventCalendar 
          events={data.events} 
          journalEntries={data.journalEntries} 
          aquariums={data.aquariums} 
        />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Aquariums Section */}
          <section className="space-y-4">
            <SectionHeader
              title={t.dashboard.aquariums}
              actions={<AddAquariumDialog onAdd={addAquarium} users={rawData.users} currentUserId={currentUserId} waterSources={data.waterSources} />}
            />
            {data.aquariums.length === 0 ? (
              <EmptyState
                title={t.dashboard.noAquariums}
                description={t.dashboard.noAquariumsHint}
              />
            ) : (
              <div className="space-y-3">
                {data.aquariums.map((aquarium) => (
                  <AquariumCard
                    key={aquarium.id}
                    aquarium={aquarium}
                    fishCount={data.fish.filter(f => f.aquariumId === aquarium.id).reduce((acc, f) => acc + f.count, 0)}
                    plantCount={data.plants.filter(p => p.aquariumId === aquarium.id).reduce((acc, p) => acc + p.count, 0)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Events Section */}
          <section className="space-y-4">
            <SectionHeader
              title={t.dashboard.events}
              actions={<AddEventDialog aquariums={data.aquariums} onAdd={addEvent} />}
            />
            {eventGroups.length === 0 ? (
              <EmptyState
                title={t.dashboard.noEvents}
                description={t.dashboard.noEventsHint}
              />
            ) : (
              <div className="space-y-4">
                {eventGroups.map((group) => (
                  <div key={group.label} className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {group.label}
                    </h3>
                    <div className="space-y-2">
                      {group.events.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          aquariumName={data.aquariums.find(a => a.id === event.aquariumId)?.name}
                          onToggle={() => toggleEvent(event.id)}
                          onDelete={() => deleteEvent(event.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </PageWrapper>
    </Layout>
  );
};

export default Dashboard;
