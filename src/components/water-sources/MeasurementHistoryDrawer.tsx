import { Droplets, Trash2, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useI18n } from '@/lib/i18n';
import type { WaterSource, WaterSourceMeasurement } from '@/lib/storage';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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

interface MeasurementHistoryDrawerProps {
  waterSource: WaterSource;
  measurements: WaterSourceMeasurement[];
  onClose: () => void;
  onDeleteMeasurement: (id: string) => void;
}

export const MeasurementHistoryDrawer = ({ 
  waterSource, 
  measurements, 
  onClose, 
  onDeleteMeasurement 
}: MeasurementHistoryDrawerProps) => {
  const { language } = useI18n();

  const formatParam = (value: number | undefined, unit: string = '') => {
    if (value === undefined || value === null) return '—';
    return `${value}${unit}`;
  };

  return (
    <Sheet open onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg border-l-2">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            {language === 'cs' ? 'Historie měření' : 'Measurement History'}: {waterSource.name}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
          {measurements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'cs' ? 'Zatím žádná měření' : 'No measurements yet'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {measurements.map((measurement, index) => (
                <div 
                  key={measurement.id} 
                  className="p-4 rounded-lg border-2 bg-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {format(new Date(measurement.date), 'd.M.yyyy')}
                      </span>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {language === 'cs' ? 'Nejnovější' : 'Latest'}
                        </Badge>
                      )}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {language === 'cs' ? 'Smazat měření?' : 'Delete measurement?'}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {language === 'cs' 
                              ? 'Tato akce je nevratná.' 
                              : 'This action cannot be undone.'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{language === 'cs' ? 'Zrušit' : 'Cancel'}</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeleteMeasurement(measurement.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {language === 'cs' ? 'Smazat' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Key Parameters */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">GH</p>
                      <p className="font-semibold text-sm">{formatParam(measurement.gh, '°')}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">KH</p>
                      <p className="font-semibold text-sm">{formatParam(measurement.kh, '°')}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">pH</p>
                      <p className="font-semibold text-sm">{formatParam(measurement.ph)}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">TDS</p>
                      <p className="font-semibold text-sm">{formatParam(measurement.tds)}</p>
                    </div>
                  </div>

                  {/* Extended Parameters */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {measurement.nitrate !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>NO₃:</span>
                        <span className="font-medium text-foreground">{measurement.nitrate} mg/l</span>
                      </div>
                    )}
                    {measurement.calcium !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>Ca:</span>
                        <span className="font-medium text-foreground">{measurement.calcium} mg/l</span>
                      </div>
                    )}
                    {measurement.magnesium !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>Mg:</span>
                        <span className="font-medium text-foreground">{measurement.magnesium} mg/l</span>
                      </div>
                    )}
                    {measurement.potassium !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>K:</span>
                        <span className="font-medium text-foreground">{measurement.potassium} mg/l</span>
                      </div>
                    )}
                    {measurement.temperature !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>°C:</span>
                        <span className="font-medium text-foreground">{measurement.temperature}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {measurement.notes && (
                    <div className="text-xs text-muted-foreground flex items-start gap-2 pt-2 border-t">
                      <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{measurement.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
