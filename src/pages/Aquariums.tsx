import { Layout } from '@/components/layout/Layout';
import { AquariumCard } from '@/components/dashboard/AquariumCard';
import { AddAquariumDialog } from '@/components/forms/AddAquariumDialog';
import { useAppData } from '@/hooks/useAppData';
import { useI18n } from '@/lib/i18n';

const Aquariums = () => {
  const { data, rawData, currentUserId, addAquarium } = useAppData();
  const { t } = useI18n();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.aquarium.title}</h1>
            <p className="text-muted-foreground">{t.aquarium.subtitle}</p>
          </div>
          <AddAquariumDialog onAdd={addAquarium} users={rawData.users} currentUserId={currentUserId} />
        </div>

        {data.aquariums.length === 0 ? (
          <div className="theme-empty p-12">
            <p className="text-lg">{t.aquarium.noAquariums}</p>
            <p className="text-sm mt-2">{t.aquarium.noAquariumsHint}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
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
      </div>
    </Layout>
  );
};

export default Aquariums;
