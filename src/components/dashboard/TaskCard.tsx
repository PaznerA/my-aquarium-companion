import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import type { Task } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  aquariumName?: string;
  onToggle: () => void;
  onDelete: () => void;
}

export const TaskCard = ({ task, aquariumName, onToggle, onDelete }: TaskCardProps) => {
  const { t, language } = useI18n();
  
  const taskTypeLabels: Record<Task['type'], string> = {
    maintenance: t.tasks.maintenance,
    feeding: t.tasks.feeding,
    waterChange: t.tasks.waterChange,
    dosing: t.tasks.dosing,
  };

  const taskTypeColors: Record<Task['type'], string> = {
    maintenance: 'bg-accent',
    feeding: 'bg-secondary',
    waterChange: 'bg-muted',
    dosing: 'bg-accent',
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  const recurringLabels: Record<string, string> = {
    daily: t.tasks.daily,
    weekly: t.tasks.weekly,
    biweekly: t.tasks.biweekly,
    monthly: t.tasks.monthly,
  };

  return (
    <Card className={cn(
      'p-4 border-2 transition-all hover:shadow-sm',
      task.completed && 'opacity-60',
      isOverdue && 'border-destructive'
    )}>
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 mt-0.5"
          onClick={onToggle}
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('px-2 py-0.5 text-xs font-medium', taskTypeColors[task.type])}>
              {taskTypeLabels[task.type]}
            </span>
            {aquariumName && (
              <span className="text-xs text-muted-foreground truncate">
                {aquariumName}
              </span>
            )}
          </div>
          <p className={cn('font-medium', task.completed && 'line-through')}>
            {task.title}
          </p>
          <p className={cn('text-sm text-muted-foreground', isOverdue && 'text-destructive')}>
            {new Date(task.dueDate).toLocaleDateString(language === 'cs' ? 'cs-CZ' : 'en-US')}
            {task.recurring && ` • ${recurringLabels[task.recurring] || task.recurring}`}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
