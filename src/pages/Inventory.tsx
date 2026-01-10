import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Beaker, Wrench, Plus, Trash2 } from 'lucide-react';
import type { Equipment, Fertilizer } from '@/lib/storage';

const equipmentTypes: { value: Equipment['type']; label: string }[] = [
  { value: 'filter', label: 'Filtr' },
  { value: 'heater', label: 'Topení' },
  { value: 'light', label: 'Osvětlení' },
  { value: 'co2', label: 'CO₂ systém' },
  { value: 'pump', label: 'Čerpadlo' },
  { value: 'other', label: 'Ostatní' },
];

const Inventory = () => {
  const { data, addFertilizer, deleteFertilizer, addEquipment, deleteEquipment } = useAppData();

  const [fertName, setFertName] = useState('');
  const [fertBrand, setFertBrand] = useState('');
  const [fertVolume, setFertVolume] = useState('');
  const [fertUnit, setFertUnit] = useState<Fertilizer['unit']>('ml');

  const [eqName, setEqName] = useState('');
  const [eqType, setEqType] = useState<Equipment['type']>('filter');
  const [eqBrand, setEqBrand] = useState('');

  const inventoryEquipment = data.equipment.filter(e => e.isInventory);

  const handleAddFertilizer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fertName && fertBrand) {
      addFertilizer({
        name: fertName,
        brand: fertBrand,
        volume: parseFloat(fertVolume) || 0,
        unit: fertUnit,
      });
      setFertName('');
      setFertBrand('');
      setFertVolume('');
    }
  };

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (eqName) {
      addEquipment({
        name: eqName,
        type: eqType,
        brand: eqBrand || undefined,
        isInventory: true,
      });
      setEqName('');
      setEqType('filter');
      setEqBrand('');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zásoby</h1>
          <p className="text-muted-foreground">Správa hnojiv a vybavení</p>
        </div>

        <Tabs defaultValue="fertilizers" className="space-y-4">
          <TabsList className="border-2">
            <TabsTrigger value="fertilizers" className="gap-2">
              <Beaker className="h-4 w-4" />
              Hnojiva
            </TabsTrigger>
            <TabsTrigger value="equipment" className="gap-2">
              <Wrench className="h-4 w-4" />
              Technika
            </TabsTrigger>
          </TabsList>

          {/* Fertilizers Tab */}
          <TabsContent value="fertilizers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Hnojiva ({data.fertilizers.length})</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Přidat hnojivo
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-2">
                  <DialogHeader>
                    <DialogTitle>Nové hnojivo</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddFertilizer} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Název</Label>
                      <Input
                        value={fertName}
                        onChange={e => setFertName(e.target.value)}
                        placeholder="Např. Mikro hnojivo"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Značka</Label>
                      <Input
                        value={fertBrand}
                        onChange={e => setFertBrand(e.target.value)}
                        placeholder="Např. Seachem"
                        className="border-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Množství</Label>
                        <Input
                          type="number"
                          value={fertVolume}
                          onChange={e => setFertVolume(e.target.value)}
                          placeholder="500"
                          className="border-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Jednotka</Label>
                        <Select value={fertUnit} onValueChange={(v) => setFertUnit(v as Fertilizer['unit'])}>
                          <SelectTrigger className="border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Přidat</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {data.fertilizers.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>Zatím žádná hnojiva</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {data.fertilizers.map(fert => (
                  <Card key={fert.id} className="p-4 border-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{fert.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {fert.brand} • {fert.volume} {fert.unit}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteFertilizer(fert.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Technika ({inventoryEquipment.length})</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Přidat vybavení
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-2">
                  <DialogHeader>
                    <DialogTitle>Nové vybavení</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddEquipment} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Název</Label>
                      <Input
                        value={eqName}
                        onChange={e => setEqName(e.target.value)}
                        placeholder="Např. Eheim Classic 250"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Typ</Label>
                      <Select value={eqType} onValueChange={(v) => setEqType(v as Equipment['type'])}>
                        <SelectTrigger className="border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentTypes.map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Značka (volitelné)</Label>
                      <Input
                        value={eqBrand}
                        onChange={e => setEqBrand(e.target.value)}
                        placeholder="Např. Eheim"
                        className="border-2"
                      />
                    </div>
                    <Button type="submit" className="w-full">Přidat</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {inventoryEquipment.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>Zatím žádné vybavení</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {inventoryEquipment.map(eq => (
                  <Card key={eq.id} className="p-4 border-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{eq.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {equipmentTypes.find(t => t.value === eq.type)?.label}
                        {eq.brand && ` • ${eq.brand}`}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteEquipment(eq.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Inventory;
