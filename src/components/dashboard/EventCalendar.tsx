import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { cs, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import type { AquariumEvent, JournalEntry, Aquarium } from '@/lib/storage';

interface EventCalendarProps {
  events: AquariumEvent[];
  journalEntries: JournalEntry[];
  aquariums: Aquarium[];
}

interface CalendarItem {
  id: string;
  date: Date;
  type: 'event' | 'journal';
  title: string;
  completed?: boolean;
  eventType?: string;
  aquariumName?: string;
  aquariumId?: string;
}

export const EventCalendar = ({ events, journalEntries, aquariums }: EventCalendarProps) => {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const dateLocale = language === 'cs' ? cs : enUS;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');

  // Get date range based on view
  const dateRange = useMemo(() => {
    if (view === 'week') {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    }
    return {
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    };
  }, [currentDate, view]);

  const days = useMemo(() => 
    eachDayOfInterval({ start: dateRange.start, end: dateRange.end }),
    [dateRange]
  );

  // Combine events and journal entries into calendar items
  const calendarItems = useMemo(() => {
    const items: CalendarItem[] = [];

    // Add events
    events.forEach(event => {
      items.push({
        id: event.id,
        date: parseISO(event.date),
        type: 'event',
        title: event.title,
        completed: event.completed,
        eventType: event.type,
        aquariumId: event.aquariumId,
        aquariumName: event.aquariumId 
          ? aquariums.find(a => a.id === event.aquariumId)?.name 
          : undefined,
      });
    });

    // Add journal entries as "auto-events"
    journalEntries.forEach(entry => {
      const aquarium = aquariums.find(a => a.id === entry.aquariumId);
      if (aquarium) {
        items.push({
          id: `journal-${entry.id}`,
          date: parseISO(entry.date),
          type: 'journal',
          title: aquarium.name,
          completed: true,
          aquariumId: entry.aquariumId,
          aquariumName: aquarium.name,
        });
      }
    });

    return items;
  }, [events, journalEntries, aquariums]);

  // Get items for a specific day
  const getItemsForDay = (day: Date) => {
    return calendarItems.filter(item => isSameDay(item.date, day));
  };

  // Handle day click - navigate to journal
  const handleDayClick = (day: Date) => {
    const dayItems = getItemsForDay(day);
    const journalItem = dayItems.find(i => i.type === 'journal');
    const eventItem = dayItems.find(i => i.type === 'event' && i.aquariumId);
    
    let aquariumId: string | undefined;
    
    if (journalItem) {
      aquariumId = journalItem.aquariumId;
    } else if (eventItem) {
      aquariumId = eventItem.aquariumId;
    } else if (aquariums.length > 0) {
      aquariumId = aquariums[0].id;
    }

    if (aquariumId) {
      const dateStr = format(day, 'yyyy-MM-dd');
      navigate(`/aquariums/${aquariumId}/journal?date=${dateStr}`);
    }
  };

  // Navigation
  const goToPrev = () => {
    if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = new Date();

  return (
    <Card className="border-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goToPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday} className="ml-2">
            {t.events.today}
          </Button>
        </div>
        
        <h3 className="font-bold text-lg">
          {view === 'week' 
            ? `${format(dateRange.start, 'd', { locale: dateLocale })} - ${format(dateRange.end, 'd. MMMM yyyy', { locale: dateLocale })}`
            : format(currentDate, 'MMMM yyyy', { locale: dateLocale })
          }
        </h3>

        <Tabs value={view} onValueChange={(v) => setView(v as 'week' | 'month')}>
          <TabsList>
            <TabsTrigger value="week" className="gap-1">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'cs' ? 'Týden' : 'Week'}</span>
            </TabsTrigger>
            <TabsTrigger value="month" className="gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'cs' ? 'Měsíc' : 'Month'}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Calendar Grid */}
      <div className={cn(
        "grid",
        view === 'week' ? "grid-cols-7" : "grid-cols-7"
      )}>
        {/* Day Headers */}
        {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map((day, idx) => (
          <div 
            key={idx} 
            className="p-2 text-center text-xs font-bold uppercase text-muted-foreground border-b-2 border-border bg-muted/20"
          >
            {language === 'cs' ? day : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
          </div>
        ))}

        {/* Days */}
        {days.map((day, idx) => {
          const dayItems = getItemsForDay(day);
          const isToday = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const eventItems = dayItems.filter(i => i.type === 'event');
          const journalItems = dayItems.filter(i => i.type === 'journal');

          return (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "min-h-[80px] p-1 border-b border-r border-border transition-colors hover:bg-muted/30 cursor-pointer",
                      view === 'month' && !isCurrentMonth && "bg-muted/10 opacity-50",
                      isToday && "bg-primary/5"
                    )}
                  >
                    {/* Date Number */}
                    <div className={cn(
                      "text-sm font-bold mb-1 w-7 h-7 flex items-center justify-center rounded-full",
                      isToday && "bg-primary text-primary-foreground"
                    )}>
                      {format(day, 'd')}
                    </div>

                    {/* Items Preview */}
                    <div className="space-y-0.5">
                      {eventItems.slice(0, 2).map(item => (
                        <div
                          key={item.id}
                          className={cn(
                            "text-xs px-1 py-0.5 rounded truncate",
                            item.completed 
                              ? "bg-primary/20 text-primary line-through" 
                              : "bg-accent text-accent-foreground"
                          )}
                        >
                          {item.title}
                        </div>
                      ))}
                      {journalItems.length > 0 && (
                        <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          <span>{journalItems.length}</span>
                        </div>
                      )}
                      {eventItems.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{eventItems.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>

                {dayItems.length > 0 && (
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-bold">{format(day, 'd. MMMM', { locale: dateLocale })}</p>
                      <ScrollArea className="max-h-40">
                        <div className="space-y-1">
                          {eventItems.map(item => (
                            <div key={item.id} className="flex items-center gap-2 text-sm">
                              <Badge variant={item.completed ? "secondary" : "default"} className="text-xs">
                                {t.events[item.eventType as keyof typeof t.events] || item.eventType}
                              </Badge>
                              <span className={item.completed ? "line-through" : ""}>{item.title}</span>
                            </div>
                          ))}
                          {journalItems.map(item => (
                            <div key={item.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <BookOpen className="h-3 w-3" />
                              <span>{language === 'cs' ? 'Zápis deníku' : 'Journal entry'}: {item.aquariumName}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 p-3 border-t-2 border-border bg-muted/20 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-accent" />
          <span>{language === 'cs' ? 'Plánovaná událost' : 'Planned event'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary/20" />
          <span>{language === 'cs' ? 'Dokončeno' : 'Completed'}</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="h-3 w-3 text-muted-foreground" />
          <span>{language === 'cs' ? 'Zápis deníku' : 'Journal entry'}</span>
        </div>
      </div>
    </Card>
  );
};
