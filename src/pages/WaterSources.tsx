import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageWrapper, PageHeader, SectionHeader, EmptyState, ContentGrid } from '@/components/common';
import { useAppDataContext } from '@/contexts';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Droplets, Plus, Pencil, Trash2, FlaskConical, 
  Thermometer, Gauge, Info, Lightbulb, Calendar,
  FileText, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { AddWaterSourceDialog } from '@/components/water-sources/AddWaterSourceDialog';
import { EditWaterSourceDialog } from '@/components/water-sources/EditWaterSourceDialog';
import { AddMeasurementDialog } from '@/components/water-sources/AddMeasurementDialog';
import { MeasurementHistoryDrawer } from '@/components/water-sources/MeasurementHistoryDrawer';
import { WaterSourceTips } from '@/components/water-sources/WaterSourceTips';
import type { WaterSource, WaterSourceMeasurement } from '@/lib/storage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const WaterSources = () => {
  const { t, language } = useI18n();
  const { 
    data, 
    addWaterSource, 
    updateWaterSource, 
    deleteWaterSource,
    addWaterSourceMeasurement,
    updateWaterSourceMeasurement,
    deleteWaterSourceMeasurement,
  } = useAppDataContext();

  const [editSource, setEditSource] = useState<WaterSource | null>(null);
  const [historySource, setHistorySource] = useState<WaterSource | null>(null);

  const getTypeLabel = (type: WaterSource['type']) => {
    const labels: Record<WaterSource['type'], { cs: string; en: string }> = {
      tap: { cs: 'Kohoutková', en: 'Tap' },
      ro: { cs: 'RO', en: 'RO' },
      rainwater: { cs: 'Dešťová', en: 'Rainwater' },
      well: { cs: 'Studna', en: 'Well' },
      mixed: { cs: 'Smíchaná', en: 'Mixed' },
      other: { cs: 'Jiná', en: 'Other' },
    };
    return labels[type][language];
  };

  const getTypeColor = (type: WaterSource['type']) => {
    const colors: Record<WaterSource['type'], string> = {
      tap: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      ro: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      rainwater: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      well: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      mixed: 'bg-green-500/10 text-green-500 border-green-500/20',
      other: 'bg-muted text-muted-foreground border-muted-foreground/20',
    };
    return colors[type];
  };

  const getMeasurementsForSource = (sourceId: string) => {
    return data.waterSourceMeasurements
      .filter(m => m.waterSourceId === sourceId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getLatestMeasurement = (sourceId: string): WaterSourceMeasurement | undefined => {
    const measurements = getMeasurementsForSource(sourceId);
    return measurements[0];
  };

  const formatParam = (value: number | undefined, unit: string = '') => {
    if (value === undefined || value === null) return '—';
    return `${value}${unit}`;
  };

  const getConnectedAquariums = (sourceId: string) => {
    return data.aquariums.filter(a => a.waterSourceId === sourceId);
  };

  return (
    <Layout>
      <PageWrapper className="space-y-8">
        <PageHeader
          title={language === 'cs' ? 'Vstupní voda' : 'Water Sources'}
          subtitle={language === 'cs' 
            ? 'Správa zdrojů vody pro vaše akvária' 
            : 'Manage water sources for your aquariums'}
          actions={
            <AddWaterSourceDialog onAdd={addWaterSource} />
          }
        />

        <Tabs defaultValue="sources" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="sources" className="gap-2">
              <Droplets className="h-4 w-4" />
              {language === 'cs' ? 'Zdroje' : 'Sources'}
            </TabsTrigger>
            <TabsTrigger value="tips" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              {language === 'cs' ? 'Tipy' : 'Tips'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="mt-6">
            {data.waterSources.length === 0 ? (
              <EmptyState
                icon={Droplets}
                title={language === 'cs' ? 'Žádné zdroje vody' : 'No water sources'}
                description={language === 'cs' 
                  ? 'Přidejte svůj první zdroj vody pro sledování parametrů' 
                  : 'Add your first water source to track parameters'}
                action={<AddWaterSourceDialog onAdd={addWaterSource} />}
              />
            ) : (
              <ContentGrid columns={2}>
                {data.waterSources.map(source => {
                  const latest = getLatestMeasurement(source.id);
                  const measurements = getMeasurementsForSource(source.id);
                  const connectedAquariums = getConnectedAquariums(source.id);

                  return (
                    <Card key={source.id} className="border-2 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Droplets className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {source.name}
                                {source.isDefault && (
                                  <Badge variant="secondary" className="text-xs">
                                    {language === 'cs' ? 'Výchozí' : 'Default'}
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={getTypeColor(source.type)}>
                                  {getTypeLabel(source.type)}
                                </Badge>
                                {connectedAquariums.length > 0 && (
                                  <span className="text-xs">
                                    {connectedAquariums.length} {language === 'cs' ? 'akvárií' : 'aquariums'}
                                  </span>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => setEditSource(source)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {language === 'cs' ? 'Smazat zdroj vody?' : 'Delete water source?'}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {language === 'cs' 
                                      ? 'Tato akce odstraní zdroj a všechna jeho měření.' 
                                      : 'This will remove the source and all its measurements.'}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{language === 'cs' ? 'Zrušit' : 'Cancel'}</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteWaterSource(source.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {language === 'cs' ? 'Smazat' : 'Delete'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Key Parameters */}
                        <div className="grid grid-cols-4 gap-3 text-center">
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground">GH</p>
                            <p className="font-semibold">{formatParam(latest?.gh ?? source.gh, '°')}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground">KH</p>
                            <p className="font-semibold">{formatParam(latest?.kh ?? source.kh, '°')}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground">pH</p>
                            <p className="font-semibold">{formatParam(latest?.ph ?? source.ph)}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground">NO₃</p>
                            <p className="font-semibold">{formatParam(latest?.nitrate ?? source.nitrate)}</p>
                          </div>
                        </div>

                        {/* Extended Parameters */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span>Ca:</span>
                            <span className="font-medium text-foreground">
                              {formatParam(latest?.calcium ?? source.calcium, ' mg/l')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span>Mg:</span>
                            <span className="font-medium text-foreground">
                              {formatParam(latest?.magnesium ?? source.magnesium, ' mg/l')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span>K:</span>
                            <span className="font-medium text-foreground">
                              {formatParam(latest?.potassium ?? source.potassium, ' mg/l')}
                            </span>
                          </div>
                        </div>

                        {/* Latest measurement info */}
                        {latest && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {language === 'cs' ? 'Poslední měření:' : 'Last measured:'}{' '}
                              {format(new Date(latest.date), 'd.M.yyyy')}
                            </span>
                          </div>
                        )}

                        {/* Notes */}
                        {source.notes && (
                          <div className="text-xs text-muted-foreground flex items-start gap-2 pt-2 border-t">
                            <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{source.notes}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <AddMeasurementDialog 
                            waterSource={source} 
                            onAdd={addWaterSourceMeasurement} 
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 gap-2"
                            onClick={() => setHistorySource(source)}
                          >
                            <Clock className="h-4 w-4" />
                            {language === 'cs' ? 'Historie' : 'History'}
                            {measurements.length > 0 && (
                              <Badge variant="secondary" className="ml-1">
                                {measurements.length}
                              </Badge>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </ContentGrid>
            )}
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <WaterSourceTips />
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editSource && (
          <EditWaterSourceDialog
            waterSource={editSource}
            onUpdate={updateWaterSource}
            onClose={() => setEditSource(null)}
          />
        )}

        {/* History Drawer */}
        {historySource && (
          <MeasurementHistoryDrawer
            waterSource={historySource}
            measurements={getMeasurementsForSource(historySource.id)}
            onClose={() => setHistorySource(null)}
            onDeleteMeasurement={deleteWaterSourceMeasurement}
          />
        )}
      </PageWrapper>
    </Layout>
  );
};

export default WaterSources;
