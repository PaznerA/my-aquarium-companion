import { Layout } from '@/components/layout/Layout';
import { PageHeader, EmptyState, PageWrapper, ContentGrid } from '@/components/common';
import { AquariumCard } from '@/components/dashboard/AquariumCard';
import { AddAquariumDialog } from '@/components/forms/AddAquariumDialog';
import { useAppData } from '@/hooks/useAppData';
import { useI18n } from '@/lib/i18n';

const Aquariums = () => {
  const { data, rawData, currentUserId, addAquarium } = useAppData();
  const { t } = useI18n();

  return (
    <Layout>
      <PageWrapper>
        <PageHeader
          title={t.aquarium.title}
          subtitle={t.aquarium.subtitle}
          actions={<AddAquariumDialog onAdd={addAquarium} users={rawData.users} currentUserId={currentUserId} waterSources={data.waterSources} />}
        />

        {data.aquariums.length === 0 ? (
          <EmptyState
            title={t.aquarium.noAquariums}
            description={t.aquarium.noAquariumsHint}
            className="p-12"
          />
        ) : (
          <ContentGrid columns={2} gap={4}>
            {data.aquariums.map((aquarium) => (
              <AquariumCard
                key={aquarium.id}
                aquarium={aquarium}
                fishCount={data.fish.filter(f => f.aquariumId === aquarium.id).reduce((acc, f) => acc + f.count, 0)}
                plantCount={data.plants.filter(p => p.aquariumId === aquarium.id).reduce((acc, p) => acc + p.count, 0)}
              />
            ))}
          </ContentGrid>
        )}
      </PageWrapper>
    </Layout>
  );
};

export default Aquariums;
