import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAppData } from '@/hooks/useAppData';
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
import { ArrowLeft, Fish, Leaf, Droplets, Plus, Trash2, Activity, BookOpen, Image } from 'lucide-react';
import { Gallery } from '@/components/gallery/Gallery';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AquariumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data,
    deleteAquarium,
    addFish,
    deleteFish,
    addPlant,
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
          <p>Akvárium nenalezeno</p>
          <Button onClick={() => navigate('/aquariums')} className="mt-4">
            Zpět na akvária
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
    if (confirm('Opravdu chcete smazat toto akvárium?')) {
      deleteAquarium(aquarium.id);
      navigate('/aquariums');
    }
  };

  const chartData = waterParams.map(p => ({
    date: new Date(p.date).toLocaleDateString('cs-CZ'),
    pH: p.ph,
    'NH₃': p.ammonia,
    'NO₂': p.nitrite,
    'NO₃': p.nitrate,
    '°C': p.temperature,
  }));

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
            <p className="text-muted-foreground">{aquarium.volume}L</p>
          </div>
          <Button variant="outline" className="border-2 gap-2" onClick={() => navigate(`/aquariums/${id}/journal`)}>
            <BookOpen className="h-4 w-4" />
            Deník
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Smazat
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="fish" className="space-y-4">
          <TabsList className="border-2">
            <TabsTrigger value="fish" className="gap-2">
              <Fish className="h-4 w-4" />
              Ryby
            </TabsTrigger>
            <TabsTrigger value="plants" className="gap-2">
              <Leaf className="h-4 w-4" />
              Rostliny
            </TabsTrigger>
            <TabsTrigger value="water" className="gap-2">
              <Droplets className="h-4 w-4" />
              Voda
            </TabsTrigger>
            <TabsTrigger value="chart" className="gap-2">
              <Activity className="h-4 w-4" />
              Graf
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <Image className="h-4 w-4" />
              Galerie
            </TabsTrigger>
          </TabsList>

          {/* Fish Tab */}
          <TabsContent value="fish" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Ryby ({aquariumFish.reduce((acc, f) => acc + f.count, 0)})</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Přidat rybu
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-2">
                  <DialogHeader>
                    <DialogTitle>Přidat rybu</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddFish} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Název</Label>
                      <Input value={fishName} onChange={e => setFishName(e.target.value)} className="border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label>Druh</Label>
                      <Input value={fishSpecies} onChange={e => setFishSpecies(e.target.value)} className="border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label>Počet</Label>
                      <Input type="number" value={fishCount} onChange={e => setFishCount(e.target.value)} className="border-2" />
                    </div>
                    <Button type="submit" className="w-full">Přidat</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {aquariumFish.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>Zatím žádné ryby</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {aquariumFish.map(fish => (
                  <Card key={fish.id} className="p-4 border-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{fish.name}</p>
                      <p className="text-sm text-muted-foreground">{fish.species} • {fish.count}×</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteFish(fish.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Plants Tab */}
          <TabsContent value="plants" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Rostliny ({aquariumPlants.reduce((acc, p) => acc + p.count, 0)})</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Přidat rostlinu
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-2">
                  <DialogHeader>
                    <DialogTitle>Přidat rostlinu</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddPlant} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Název</Label>
                      <Input value={plantName} onChange={e => setPlantName(e.target.value)} className="border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label>Druh</Label>
                      <Input value={plantSpecies} onChange={e => setPlantSpecies(e.target.value)} className="border-2" />
                    </div>
                    <div className="space-y-2">
                      <Label>Počet</Label>
                      <Input type="number" value={plantCount} onChange={e => setPlantCount(e.target.value)} className="border-2" />
                    </div>
                    <Button type="submit" className="w-full">Přidat</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {aquariumPlants.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>Zatím žádné rostliny</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {aquariumPlants.map(plant => (
                  <Card key={plant.id} className="p-4 border-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{plant.name}</p>
                      <p className="text-sm text-muted-foreground">{plant.species} • {plant.count}×</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deletePlant(plant.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Water Parameters Tab */}
          <TabsContent value="water" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Parametry vody</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Přidat měření
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-2 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Nové měření</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddWaterParam} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Datum</Label>
                      <Input type="date" value={paramDate} onChange={e => setParamDate(e.target.value)} className="border-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>pH</Label>
                        <Input type="number" step="0.1" value={ph} onChange={e => setPh(e.target.value)} className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>Teplota (°C)</Label>
                        <Input type="number" step="0.5" value={temperature} onChange={e => setTemperature(e.target.value)} className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>Amoniak (mg/L)</Label>
                        <Input type="number" step="0.01" value={ammonia} onChange={e => setAmmonia(e.target.value)} className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>Dusitany (mg/L)</Label>
                        <Input type="number" step="0.01" value={nitrite} onChange={e => setNitrite(e.target.value)} className="border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>Dusičnany (mg/L)</Label>
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
                    <Button type="submit" className="w-full">Uložit</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {waterParams.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>Zatím žádná měření</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {waterParams.slice().reverse().map(param => (
                  <Card key={param.id} className="p-4 border-2">
                    <p className="font-bold mb-2">{new Date(param.date).toLocaleDateString('cs-CZ')}</p>
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
            <h2 className="text-xl font-bold">Historie parametrů</h2>
            {chartData.length < 2 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>Přidejte alespoň 2 měření pro zobrazení grafu</p>
              </div>
            ) : (
              <Card className="p-4 border-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '2px solid hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="pH" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="°C" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="NO₃" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-4">
            <h2 className="text-xl font-bold">Galerie</h2>
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
