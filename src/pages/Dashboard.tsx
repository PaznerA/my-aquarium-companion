import { Layout } from '@/components/layout/Layout';
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
            <p className="text-muted-foreground">{t.dashboard.subtitle}</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Quick Stats */}
        <QuickStats data={data} />

        {/* Event Calendar */}
        <EventCalendar 
          events={data.events} 
          journalEntries={data.journalEntries} 
          aquariums={data.aquariums} 
        />

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Aquariums */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t.dashboard.aquariums}</h2>
              <AddAquariumDialog onAdd={addAquarium} users={rawData.users} currentUserId={currentUserId} />
            </div>
            {data.aquariums.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>{t.dashboard.noAquariums}</p>
                <p className="text-sm">{t.dashboard.noAquariumsHint}</p>
              </div>
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

          {/* Events */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t.dashboard.events}</h2>
              <AddEventDialog aquariums={data.aquariums} onAdd={addEvent} />
            </div>
            {eventGroups.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>{t.dashboard.noEvents}</p>
                <p className="text-sm">{t.dashboard.noEventsHint}</p>
              </div>
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
      </div>
    </Layout>
  );
};

export default Dashboard;
