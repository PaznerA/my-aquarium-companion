import { Layout } from '@/components/layout/Layout';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { AquariumCard } from '@/components/dashboard/AquariumCard';
import { EventCard } from '@/components/events/EventCard';
import { AddAquariumDialog } from '@/components/forms/AddAquariumDialog';
import { AddEventDialog } from '@/components/forms/AddEventDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAppData } from '@/hooks/useAppData';
import { useI18n } from '@/lib/i18n';

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
  const { t } = useI18n();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = data.events
    .filter(e => !e.completed && new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
            {upcomingEvents.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>{t.dashboard.noEvents}</p>
                <p className="text-sm">{t.dashboard.noEventsHint}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    aquariumName={data.aquariums.find(a => a.id === event.aquariumId)?.name}
                    onToggle={() => toggleEvent(event.id)}
                    onDelete={() => deleteEvent(event.id)}
                  />
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
