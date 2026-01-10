import { Droplets, Fish, Leaf, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { AppData } from '@/lib/storage';

interface QuickStatsProps {
  data: AppData;
}

export const QuickStats = ({ data }: QuickStatsProps) => {
  const stats = [
    {
      label: 'Akvária',
      value: data.aquariums.length,
      icon: Droplets,
    },
    {
      label: 'Ryby',
      value: data.fish.reduce((acc, f) => acc + f.count, 0),
      icon: Fish,
    },
    {
      label: 'Rostliny',
      value: data.plants.reduce((acc, p) => acc + p.count, 0),
      icon: Leaf,
    },
    {
      label: 'Vybavení',
      value: data.equipment.length,
      icon: Wrench,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="p-4 border-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
