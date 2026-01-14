import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Beaker, Wrench, Plus, Trash2 } from 'lucide-react';
import type { Equipment, Fertilizer } from '@/lib/storage';
import { EditFertilizerDialog } from '@/components/forms/EditFertilizerDialog';
import { EditEquipmentDialog } from '@/components/forms/EditEquipmentDialog';

const Inventory = () => {
  const { data, addFertilizer, updateFertilizer, deleteFertilizer, addEquipment, updateEquipment, deleteEquipment } = useAppData();
  const { t } = useI18n();

  const equipmentTypes: { value: Equipment['type']; labelKey: keyof typeof t.equipmentTypes }[] = [
    { value: 'filter', labelKey: 'filter' },
    { value: 'heater', labelKey: 'heater' },
    { value: 'light', labelKey: 'light' },
    { value: 'co2', labelKey: 'co2' },
    { value: 'pump', labelKey: 'pump' },
    { value: 'other', labelKey: 'other' },
  ];

  const [fertName, setFertName] = useState('');
  const [fertBrand, setFertBrand] = useState('');
  const [fertVolume, setFertVolume] = useState('');
  const [fertUnit, setFertUnit] = useState<Fertilizer['unit']>('ml');
  // Nutrient content per ml/g
  const [fertNitrogen, setFertNitrogen] = useState('');
  const [fertPhosphorus, setFertPhosphorus] = useState('');
  const [fertPotassium, setFertPotassium] = useState('');
  const [fertIron, setFertIron] = useState('');

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
        nitrogenPpm: parseFloat(fertNitrogen) || undefined,
        phosphorusPpm: parseFloat(fertPhosphorus) || undefined,
        potassiumPpm: parseFloat(fertPotassium) || undefined,
        ironPpm: parseFloat(fertIron) || undefined,
      });
      setFertName('');
      setFertBrand('');
      setFertVolume('');
      setFertNitrogen('');
      setFertPhosphorus('');
      setFertPotassium('');
      setFertIron('');
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
          <h1 className="text-3xl font-bold tracking-tight">{t.inventory.title}</h1>
          <p className="text-muted-foreground">{t.inventory.subtitle}</p>
        </div>

        <Tabs defaultValue="fertilizers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fertilizers" className="gap-2">
              <Beaker className="h-4 w-4" />
              {t.inventory.fertilizers}
            </TabsTrigger>
            <TabsTrigger value="equipment" className="gap-2">
              <Wrench className="h-4 w-4" />
              {t.inventory.equipment}
            </TabsTrigger>
          </TabsList>

          {/* Fertilizers Tab */}
          <TabsContent value="fertilizers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t.inventory.fertilizers} ({data.fertilizers.length})</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t.inventory.addFertilizer}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.inventory.addFertilizer}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddFertilizer} className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t.inventory.name}</Label>
                      <Input
                        value={fertName}
                        onChange={e => setFertName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.inventory.brand}</Label>
                      <Input
                        value={fertBrand}
                        onChange={e => setFertBrand(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t.inventory.amount}</Label>
                        <Input
                          type="number"
                          value={fertVolume}
                          onChange={e => setFertVolume(e.target.value)}
                          placeholder="500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.inventory.unit}</Label>
                        <Select value={fertUnit} onValueChange={(v) => setFertUnit(v as Fertilizer['unit'])}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Nutrient Content for EI */}
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-3">
                        {t.inventory.nutrientContent.replace('{unit}', fertUnit)}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">{t.inventory.nitrogen}</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={fertNitrogen}
                            onChange={e => setFertNitrogen(e.target.value)}
                            placeholder="0"
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t.inventory.phosphorus}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={fertPhosphorus}
                            onChange={e => setFertPhosphorus(e.target.value)}
                            placeholder="0"
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t.inventory.potassium}</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={fertPotassium}
                            onChange={e => setFertPotassium(e.target.value)}
                            placeholder="0"
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t.inventory.iron}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={fertIron}
                            onChange={e => setFertIron(e.target.value)}
                            placeholder="0"
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">{t.common.add}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {data.fertilizers.length === 0 ? (
              <div className="theme-empty">
                <p>{t.inventory.noFertilizers}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {data.fertilizers.map(fert => (
                  <Card key={fert.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{fert.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {fert.brand} • {fert.volume} {fert.unit}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <EditFertilizerDialog fertilizer={fert} onUpdate={updateFertilizer} />
                      <Button variant="ghost" size="icon" onClick={() => deleteFertilizer(fert.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t.inventory.equipment} ({inventoryEquipment.length})</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t.inventory.addEquipment}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.inventory.addEquipment}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddEquipment} className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t.inventory.name}</Label>
                      <Input
                        value={eqName}
                        onChange={e => setEqName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.inventory.type}</Label>
                      <Select value={eqType} onValueChange={(v) => setEqType(v as Equipment['type'])}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {t.equipmentTypes[type.labelKey]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t.inventory.brand} ({t.common.optional})</Label>
                      <Input
                        value={eqBrand}
                        onChange={e => setEqBrand(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">{t.common.add}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {inventoryEquipment.length === 0 ? (
              <div className="theme-empty">
                <p>{t.inventory.noEquipment}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {inventoryEquipment.map(eq => (
                  <Card key={eq.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{eq.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.equipmentTypes[eq.type as keyof typeof t.equipmentTypes]}
                        {eq.brand && ` • ${eq.brand}`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <EditEquipmentDialog equipment={eq} onUpdate={updateEquipment} />
                      <Button variant="ghost" size="icon" onClick={() => deleteEquipment(eq.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
