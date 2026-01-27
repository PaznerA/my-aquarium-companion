import { Link } from 'react-router-dom';
import { Droplets, Fish, Leaf, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import type { Aquarium } from '@/types';

interface AquariumCardProps {
  aquarium: Aquarium;
  fishCount: number;
  plantCount: number;
}

export const AquariumCard = ({ aquarium, fishCount, plantCount }: AquariumCardProps) => {
  const { formatVolume } = useI18n();

  return (
    <Link to={`/aquariums/${aquarium.id}`}>
      <Card className="p-4 border-2 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-accent flex items-center justify-center rounded-sm">
              <Droplets className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{aquarium.name}</h3>
              <p className="text-sm text-muted-foreground">{formatVolume(aquarium.volume)}</p>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Fish className="h-4 w-4" />
                  {fishCount}
                </span>
                <span className="flex items-center gap-1">
                  <Leaf className="h-4 w-4" />
                  {plantCount}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  );
};
