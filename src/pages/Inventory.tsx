import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHeader, SectionHeader, EmptyState, FormField, ItemCard, PageWrapper, ContentGrid } from '@/components/common';
import { useAppDataContext } from '@/contexts';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
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
  const { data, addFertilizer, updateFertilizer, deleteFertilizer, addEquipment, updateEquipment, deleteEquipment } = useAppDataContext();
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
      <PageWrapper>
        <PageHeader
          title={t.inventory.title}
          subtitle={t.inventory.subtitle}
        />

        <Tabs defaultValue="fertilizers" className="space-y-4">
          <TabsList className="border-2">
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
            <SectionHeader
              title={t.inventory.fertilizers}
              count={data.fertilizers.length}
              actions={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      {t.inventory.addFertilizer}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2">
                    <DialogHeader>
                      <DialogTitle>{t.inventory.addFertilizer}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddFertilizer} className="space-y-4">
                      <FormField label={t.inventory.name} value={fertName} onChange={setFertName} />
                      <FormField label={t.inventory.brand} value={fertBrand} onChange={setFertBrand} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField label={t.inventory.amount} value={fertVolume} onChange={setFertVolume} type="number" placeholder="500" />
                        <FormField label={t.inventory.unit}>
                          <Select value={fertUnit} onValueChange={(v) => setFertUnit(v as Fertilizer['unit'])}>
                            <SelectTrigger className="border-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ml">ml</SelectItem>
                              <SelectItem value="g">g</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>
                      </div>
                      
                      {/* Nutrient Content */}
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-3">
                          {t.inventory.nutrientContent.replace('{unit}', fertUnit)}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField label={t.inventory.nitrogen} value={fertNitrogen} onChange={setFertNitrogen} type="number" step="0.1" placeholder="0" labelClassName="text-xs" className="space-y-1" />
                          <FormField label={t.inventory.phosphorus} value={fertPhosphorus} onChange={setFertPhosphorus} type="number" step="0.01" placeholder="0" labelClassName="text-xs" className="space-y-1" />
                          <FormField label={t.inventory.potassium} value={fertPotassium} onChange={setFertPotassium} type="number" step="0.1" placeholder="0" labelClassName="text-xs" className="space-y-1" />
                          <FormField label={t.inventory.iron} value={fertIron} onChange={setFertIron} type="number" step="0.01" placeholder="0" labelClassName="text-xs" className="space-y-1" />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full">{t.common.add}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              }
            />
            {data.fertilizers.length === 0 ? (
              <EmptyState title={t.inventory.noFertilizers} />
            ) : (
              <ContentGrid columns={2}>
                {data.fertilizers.map(fert => (
                  <ItemCard
                    key={fert.id}
                    title={fert.name}
                    subtitle={`${fert.brand} • ${fert.volume} ${fert.unit}`}
                    actions={
                      <>
                        <EditFertilizerDialog fertilizer={fert} onUpdate={updateFertilizer} />
                        <Button variant="ghost" size="icon" onClick={() => deleteFertilizer(fert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    }
                  />
                ))}
              </ContentGrid>
            )}
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-4">
            <SectionHeader
              title={t.inventory.equipment}
              count={inventoryEquipment.length}
              actions={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      {t.inventory.addEquipment}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2">
                    <DialogHeader>
                      <DialogTitle>{t.inventory.addEquipment}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddEquipment} className="space-y-4">
                      <FormField label={t.inventory.name} value={eqName} onChange={setEqName} />
                      <FormField label={t.inventory.type}>
                        <Select value={eqType} onValueChange={(v) => setEqType(v as Equipment['type'])}>
                          <SelectTrigger className="border-2">
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
                      </FormField>
                      <FormField label={`${t.inventory.brand} (${t.common.optional})`} value={eqBrand} onChange={setEqBrand} />
                      <Button type="submit" className="w-full">{t.common.add}</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              }
            />
            {inventoryEquipment.length === 0 ? (
              <EmptyState title={t.inventory.noEquipment} />
            ) : (
              <ContentGrid columns={2}>
                {inventoryEquipment.map(eq => (
                  <ItemCard
                    key={eq.id}
                    title={eq.name}
                    subtitle={`${t.equipmentTypes[eq.type as keyof typeof t.equipmentTypes]}${eq.brand ? ` • ${eq.brand}` : ''}`}
                    actions={
                      <>
                        <EditEquipmentDialog equipment={eq} onUpdate={updateEquipment} />
                        <Button variant="ghost" size="icon" onClick={() => deleteEquipment(eq.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    }
                  />
                ))}
              </ContentGrid>
            )}
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </Layout>
  );
};

export default Inventory;
