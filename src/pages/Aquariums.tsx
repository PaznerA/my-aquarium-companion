import { Layout } from '@/components/layout/Layout';
import { AquariumCard } from '@/components/dashboard/AquariumCard';
import { AddAquariumDialog } from '@/components/forms/AddAquariumDialog';
import { useAppData } from '@/hooks/useAppData';

const Aquariums = () => {
  const { data, addAquarium } = useAppData();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Akvária</h1>
            <p className="text-muted-foreground">Správa vašich akvárií</p>
          </div>
          <AddAquariumDialog onAdd={addAquarium} />
        </div>

        {data.aquariums.length === 0 ? (
          <div className="border-2 border-dashed p-12 text-center text-muted-foreground">
            <p className="text-lg">Zatím nemáte žádné akvárium</p>
            <p className="text-sm mt-2">Klikněte na "Přidat akvárium" pro vytvoření prvního</p>
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
