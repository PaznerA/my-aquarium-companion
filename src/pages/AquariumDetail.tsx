import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/aquariums')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{aquarium.name}</h1>
            <p className="text-muted-foreground">{formatVolume(aquarium.volume)}</p>
          </div>
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
        </div>

        {/* Tabs */}
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t.aquarium.fish} ({aquariumFish.reduce((acc, f) => acc + f.count, 0)})</h2>
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
                    <div className="space-y-2">
                      <Label>{t.aquarium.name}</Label>
                      <Input value={fishName} onChange={e => setFishName(e.target.value)} className="border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.aquarium.species}</Label>
                      <Input value={fishSpecies} onChange={e => setFishSpecies(e.target.value)} className="border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.aquarium.count}</Label>
                      <Input type="number" value={fishCount} onChange={e => setFishCount(e.target.value)} className="border-2" />
                    </div>
                    <Button type="submit" className="w-full">{t.common.add}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {aquariumFish.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>{t.aquarium.noFish}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {aquariumFish.map(fish => (
                  <Card key={fish.id} className="p-4 border-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{fish.name}</p>
                      <p className="text-sm text-muted-foreground">{fish.species} • {fish.count}×</p>
                    </div>
                    <div className="flex gap-1">
                      <EditFishDialog fish={fish} onUpdate={updateFish} />
                      <Button variant="ghost" size="icon" onClick={() => deleteFish(fish.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Plants Tab */}
          <TabsContent value="plants" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t.aquarium.plants} ({aquariumPlants.reduce((acc, p) => acc + p.count, 0)})</h2>
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
                    <div className="space-y-2">
                      <Label>{t.aquarium.name}</Label>
                      <Input value={plantName} onChange={e => setPlantName(e.target.value)} className="border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.aquarium.species}</Label>
                      <Input value={plantSpecies} onChange={e => setPlantSpecies(e.target.value)} className="border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.aquarium.count}</Label>
                      <Input type="number" value={plantCount} onChange={e => setPlantCount(e.target.value)} className="border-2" />
                    </div>
                    <Button type="submit" className="w-full">{t.common.add}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {aquariumPlants.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>{t.aquarium.noPlants}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {aquariumPlants.map(plant => (
                  <Card key={plant.id} className="p-4 border-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{plant.name}</p>
                      <p className="text-sm text-muted-foreground">{plant.species} • {plant.count}×</p>
                    </div>
                    <div className="flex gap-1">
                      <EditPlantDialog plant={plant} onUpdate={updatePlant} />
                      <Button variant="ghost" size="icon" onClick={() => deletePlant(plant.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Water Parameters Tab */}
          <TabsContent value="water" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t.aquarium.water}</h2>
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
                    <div className="space-y-2">
                      <Label>{t.aquarium.date}</Label>
                      <Input type="date" value={paramDate} onChange={e => setParamDate(e.target.value)} className="border-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>pH</Label>
                        <Input type="number" step="0.1" value={ph} onChange={e => setPh(e.target.value)} className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.aquarium.temperature}</Label>
                        <Input type="number" step="0.5" value={temperature} onChange={e => setTemperature(e.target.value)} className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.aquarium.ammonia} (mg/L)</Label>
                        <Input type="number" step="0.01" value={ammonia} onChange={e => setAmmonia(e.target.value)} className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.aquarium.nitrite} (mg/L)</Label>
                        <Input type="number" step="0.01" value={nitrite} onChange={e => setNitrite(e.target.value)} className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.aquarium.nitrate} (mg/L)</Label>
                        <Input type="number" step="1" value={nitrate} onChange={e => setNitrate(e.target.value)} className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>KH (°dKH)</Label>
                        <Input type="number" step="0.5" value={kh} onChange={e => setKh(e.target.value)} className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>GH (°dGH)</Label>
                        <Input type="number" step="0.5" value={gh} onChange={e => setGh(e.target.value)} className="border-2" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">{t.common.save}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {waterParams.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>{t.aquarium.noMeasurements}</p>
              </div>
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
      </div>
    </Layout>
  );
};

export default AquariumDetail;
