import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHeader, SectionHeader, EmptyState, FormField, ItemCard, PageWrapper } from '@/components/common';
import { useAppData } from '@/hooks/useAppData';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Fish, Leaf, Droplets, Plus, Trash2, Activity, BookOpen, Image, Pencil, Info } from 'lucide-react';
import { Gallery } from '@/components/gallery/Gallery';
import { AquariumChart } from '@/components/charts/AquariumChart';
import { EditFishDialog } from '@/components/forms/EditFishDialog';
import { EditPlantDialog } from '@/components/forms/EditPlantDialog';
import { EditAquariumDialog } from '@/components/forms/EditAquariumDialog';
import { SpeciesInfoDrawer } from '@/components/aquarium/SpeciesInfoDrawer';
import { useState } from 'react';

const AquariumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, formatVolume, formatTemperature, language } = useI18n();
  const {
    data,
    rawData,
    deleteAquarium,
    updateAquarium,
    addFish,
    updateFish,
    deleteFish,
    addPlant,
    updatePlant,
    deletePlant,
    addWaterParameter,
  } = useAppData();

  const aquarium = data.aquariums.find(a => a.id === id);
  const aquariumFish = data.fish.filter(f => f.aquariumId === id);
  const aquariumPlants = data.plants.filter(p => p.aquariumId === id);
  const waterParams = data.waterParameters
    .filter(w => w.aquariumId === id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const [fishName, setFishName] = useState('');
  const [fishSpecies, setFishSpecies] = useState('');
  const [fishCount, setFishCount] = useState('1');
  const [plantName, setPlantName] = useState('');
  const [plantSpecies, setPlantSpecies] = useState('');
  const [plantCount, setPlantCount] = useState('1');
  const [paramDate, setParamDate] = useState(new Date().toISOString().split('T')[0]);
  const [ph, setPh] = useState('7.0');
  const [ammonia, setAmmonia] = useState('0');
  const [nitrite, setNitrite] = useState('0');
  const [nitrate, setNitrate] = useState('0');
  const [temperature, setTemperature] = useState('25');
  const [kh, setKh] = useState('4');
  const [gh, setGh] = useState('8');

  if (!aquarium) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>{t.aquarium.notFound}</p>
          <Button onClick={() => navigate('/aquariums')} className="mt-4">
            {t.aquarium.backToAquariums}
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddFish = (e: React.FormEvent) => {
    e.preventDefault();
    if (fishName && id) {
      addFish({ name: fishName, species: fishSpecies, count: parseInt(fishCount), aquariumId: id });
      setFishName('');
      setFishSpecies('');
      setFishCount('1');
    }
  };

  const handleAddPlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (plantName && id) {
      addPlant({ name: plantName, species: plantSpecies, count: parseInt(plantCount), aquariumId: id });
      setPlantName('');
      setPlantSpecies('');
      setPlantCount('1');
    }
  };

  const handleAddWaterParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      addWaterParameter({
        aquariumId: id,
        date: paramDate,
        ph: parseFloat(ph),
        ammonia: parseFloat(ammonia),
        nitrite: parseFloat(nitrite),
        nitrate: parseFloat(nitrate),
        temperature: parseFloat(temperature),
        kh: parseFloat(kh),
        gh: parseFloat(gh),
      });
    }
  };

  const handleDelete = () => {
    if (confirm(t.aquarium.deleteConfirm)) {
      deleteAquarium(aquarium.id);
      navigate('/aquariums');
    }
  };

  return (
    <Layout>
      <PageWrapper>
        <PageHeader
          title={aquarium.name}
          subtitle={formatVolume(aquarium.volume)}
          backButton={
            <Button variant="ghost" size="icon" onClick={() => navigate('/aquariums')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          }
          actions={
            <>
              <Button variant="outline" className="border-2 gap-2" onClick={() => navigate(`/aquariums/${id}/journal`)}>
                <BookOpen className="h-4 w-4" />
                {t.aquarium.journal}
              </Button>
              <SpeciesInfoDrawer
                fish={aquariumFish}
                plants={aquariumPlants}
                aquariumVolume={aquarium.volume}
                trigger={<Button variant="outline" className="border-2 gap-2"><Info className="h-4 w-4" />{t.aquarium.speciesInfo}</Button>}
              />
              <EditAquariumDialog 
                aquarium={aquarium} 
                users={rawData.users} 
                onUpdate={updateAquarium}
                trigger={<Button variant="outline" className="border-2"><Pencil className="h-4 w-4" /></Button>}
              />
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t.common.delete}
              </Button>
            </>
          }
        />

        <Tabs defaultValue="fish" className="space-y-4">
          <TabsList className="border-2">
            <TabsTrigger value="fish" className="gap-2">
              <Fish className="h-4 w-4" />
              {t.aquarium.fish}
            </TabsTrigger>
            <TabsTrigger value="plants" className="gap-2">
              <Leaf className="h-4 w-4" />
              {t.aquarium.plants}
            </TabsTrigger>
            <TabsTrigger value="water" className="gap-2">
              <Droplets className="h-4 w-4" />
              {t.aquarium.water}
            </TabsTrigger>
            <TabsTrigger value="chart" className="gap-2">
              <Activity className="h-4 w-4" />
              {t.aquarium.chart}
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <Image className="h-4 w-4" />
              {t.aquarium.gallery}
            </TabsTrigger>
          </TabsList>

          {/* Fish Tab */}
          <TabsContent value="fish" className="space-y-4">
            <SectionHeader
              title={t.aquarium.fish}
              count={aquariumFish.reduce((acc, f) => acc + f.count, 0)}
              actions={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      {t.aquarium.addFish}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2">
                    <DialogHeader>
                      <DialogTitle>{t.aquarium.addFish}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddFish} className="space-y-4">
                      <FormField label={t.aquarium.name} value={fishName} onChange={setFishName} />
                      <FormField label={t.aquarium.species} value={fishSpecies} onChange={setFishSpecies} />
                      <FormField label={t.aquarium.count} value={fishCount} onChange={setFishCount} type="number" />
                      <Button type="submit" className="w-full">{t.common.add}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              }
            />
            {aquariumFish.length === 0 ? (
              <EmptyState title={t.aquarium.noFish} />
            ) : (
              <div className="grid gap-3">
                {aquariumFish.map(fish => (
                  <ItemCard
                    key={fish.id}
                    title={fish.name}
                    subtitle={`${fish.species} • ${fish.count}×`}
                    actions={
                      <>
                        <EditFishDialog fish={fish} onUpdate={updateFish} />
                        <Button variant="ghost" size="icon" onClick={() => deleteFish(fish.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Plants Tab */}
          <TabsContent value="plants" className="space-y-4">
            <SectionHeader
              title={t.aquarium.plants}
              count={aquariumPlants.reduce((acc, p) => acc + p.count, 0)}
              actions={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      {t.aquarium.addPlant}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2">
                    <DialogHeader>
                      <DialogTitle>{t.aquarium.addPlant}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddPlant} className="space-y-4">
                      <FormField label={t.aquarium.name} value={plantName} onChange={setPlantName} />
                      <FormField label={t.aquarium.species} value={plantSpecies} onChange={setPlantSpecies} />
                      <FormField label={t.aquarium.count} value={plantCount} onChange={setPlantCount} type="number" />
                      <Button type="submit" className="w-full">{t.common.add}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              }
            />
            {aquariumPlants.length === 0 ? (
              <EmptyState title={t.aquarium.noPlants} />
            ) : (
              <div className="grid gap-3">
                {aquariumPlants.map(plant => (
                  <ItemCard
                    key={plant.id}
                    title={plant.name}
                    subtitle={`${plant.species} • ${plant.count}×`}
                    actions={
                      <>
                        <EditPlantDialog plant={plant} onUpdate={updatePlant} />
                        <Button variant="ghost" size="icon" onClick={() => deletePlant(plant.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Water Parameters Tab */}
          <TabsContent value="water" className="space-y-4">
            <SectionHeader
              title={t.aquarium.water}
              actions={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      {t.aquarium.addMeasurement}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t.aquarium.addMeasurement}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddWaterParam} className="space-y-4">
                      <FormField label={t.aquarium.date} value={paramDate} onChange={setParamDate} type="date" />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="pH" value={ph} onChange={setPh} type="number" step="0.1" />
                        <FormField label={t.aquarium.temperature} value={temperature} onChange={setTemperature} type="number" step="0.5" />
                        <FormField label={`${t.aquarium.ammonia} (mg/L)`} value={ammonia} onChange={setAmmonia} type="number" step="0.01" />
                        <FormField label={`${t.aquarium.nitrite} (mg/L)`} value={nitrite} onChange={setNitrite} type="number" step="0.01" />
                        <FormField label={`${t.aquarium.nitrate} (mg/L)`} value={nitrate} onChange={setNitrate} type="number" step="1" />
                        <FormField label="KH (°dKH)" value={kh} onChange={setKh} type="number" step="0.5" />
                        <FormField label="GH (°dGH)" value={gh} onChange={setGh} type="number" step="0.5" />
                      </div>
                      <Button type="submit" className="w-full">{t.common.save}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              }
            />
            {waterParams.length === 0 ? (
              <EmptyState title={t.aquarium.noMeasurements} />
            ) : (
              <div className="grid gap-3">
                {waterParams.slice().reverse().map(param => (
                  <Card key={param.id} className="p-4 border-2">
                    <p className="font-bold mb-2">{new Date(param.date).toLocaleDateString(language === 'cs' ? 'cs-CZ' : 'en-US')}</p>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div><span className="text-muted-foreground">pH:</span> {param.ph}</div>
                      <div><span className="text-muted-foreground">°C:</span> {param.temperature}</div>
                      <div><span className="text-muted-foreground">NH₃:</span> {param.ammonia}</div>
                      <div><span className="text-muted-foreground">NO₂:</span> {param.nitrite}</div>
                      <div><span className="text-muted-foreground">NO₃:</span> {param.nitrate}</div>
                      <div><span className="text-muted-foreground">KH:</span> {param.kh}</div>
                      <div><span className="text-muted-foreground">GH:</span> {param.gh}</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Chart Tab */}
          <TabsContent value="chart" className="space-y-4">
            <h2 className="text-xl font-bold">{t.aquarium.historyStats}</h2>
            <AquariumChart
              aquariumId={aquarium.id}
              aquariumVolume={aquarium.volume}
              waterParameters={data.waterParameters}
              journalEntries={data.journalEntries || []}
              fertilizers={data.fertilizers}
            />
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-4">
            <h2 className="text-xl font-bold">{t.aquarium.gallery}</h2>
            <Gallery 
              aquariumId={aquarium.id} 
              journalEntries={data.journalEntries || []}
            />
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </Layout>
  );
};

export default AquariumDetail;
