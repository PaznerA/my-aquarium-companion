import { CheckCircle, Circle, Trash2, Pencil, Calendar, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import type { AquariumEvent } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: AquariumEvent;
  aquariumName?: string;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  compact?: boolean;
}

export const EventCard = ({ event, aquariumName, onToggle, onEdit, onDelete, compact }: EventCardProps) => {
  const { t, language } = useI18n();
  
  const eventTypeLabels: Record<AquariumEvent['type'], string> = {
    maintenance: t.events.maintenance,
    feeding: t.events.feeding,
    waterChange: t.events.waterChange,
    dosing: t.events.dosing,
    treatment: t.events.treatment,
    other: t.events.other,
  };

  const eventTypeColors: Record<AquariumEvent['type'], string> = {
    maintenance: 'bg-accent',
    feeding: 'bg-secondary',
    waterChange: 'bg-primary/20',
    dosing: 'bg-accent',
    treatment: 'bg-destructive/20',
    other: 'bg-muted',
  };

  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = eventDate < today && !event.completed;
  const isToday = eventDate.toDateString() === today.toDateString();
  const isFuture = eventDate > today;

  const recurringLabels: Record<string, string> = {
    daily: t.events.daily,
    weekly: t.events.weekly,
    biweekly: t.events.biweekly,
    monthly: t.events.monthly,
  };

  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-2 p-2 rounded border',
        event.completed && 'opacity-60',
        isOverdue && 'border-destructive bg-destructive/5',
        isToday && !isOverdue && 'border-primary bg-primary/5'
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 shrink-0"
          onClick={onToggle}
        >
          {event.completed ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
        </Button>
        <span className={cn('text-sm flex-1', event.completed && 'line-through')}>
          {event.title}
        </span>
        {event.recurring && <Repeat className="h-3 w-3 text-muted-foreground" />}
      </div>
    );
  }

  return (
    <Card className={cn(
      'p-4',
      event.completed && 'opacity-60',
      isOverdue && 'border-destructive',
      isToday && !isOverdue && 'border-primary'
    )}>
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 mt-0.5"
          onClick={onToggle}
        >
          {event.completed ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={cn('px-2 py-0.5 text-xs font-medium rounded-sm', eventTypeColors[event.type])}>
              {eventTypeLabels[event.type]}
            </span>
            {aquariumName && (
              <span className="text-xs text-muted-foreground truncate">
                {aquariumName}
              </span>
            )}
            {!event.aquariumId && (
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded-sm">
                {t.events.global}
              </span>
            )}
          </div>
          <p className={cn('font-medium', event.completed && 'line-through')}>
            {event.title}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span className={cn(isOverdue && 'text-destructive')}>
              {isToday ? t.events.today : eventDate.toLocaleDateString(language === 'cs' ? 'cs-CZ' : 'en-US')}
            </span>
            {event.recurring && (
              <>
                <span>•</span>
                <Repeat className="h-3 w-3" />
                <span>{recurringLabels[event.recurring]}</span>
              </>
            )}
          </div>
          {event.notes && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
