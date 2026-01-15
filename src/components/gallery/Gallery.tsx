import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import type { JournalEntry } from '@/lib/storage';

interface GalleryProps {
  aquariumId: string;
  journalEntries: JournalEntry[];
  onDeletePhoto?: (entryId: string, photoIndex: number) => void;
}

interface PhotoItem {
  entryId: string;
  entryDate: string;
  photoUrl: string;
  photoIndex: number;
}

export const Gallery = ({ aquariumId, journalEntries, onDeletePhoto }: GalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Collect all photos from journal entries
  const allPhotos: PhotoItem[] = journalEntries
    .filter(e => e.aquariumId === aquariumId && e.photos.length > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .flatMap(entry => 
      entry.photos.map((photoUrl, photoIndex) => ({
        entryId: entry.id,
        entryDate: entry.date,
        photoUrl,
        photoIndex,
      }))
    );

  const openLightbox = (photo: PhotoItem) => {
    const index = allPhotos.findIndex(
      p => p.entryId === photo.entryId && p.photoIndex === photo.photoIndex
    );
    setLightboxIndex(index);
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const goToPrevious = () => {
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
      setSelectedPhoto(allPhotos[lightboxIndex - 1]);
    }
  };

  const goToNext = () => {
    if (lightboxIndex < allPhotos.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
      setSelectedPhoto(allPhotos[lightboxIndex + 1]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeLightbox();
  };

  if (allPhotos.length === 0) {
    return (
      <div className="theme-empty p-8">
        <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Zatím žádné fotografie</p>
        <p className="text-sm mt-2">Přidejte fotky v deníku</p>
      </div>
    );
  }

  // Group photos by date
  const photosByDate = allPhotos.reduce((acc, photo) => {
    if (!acc[photo.entryDate]) {
      acc[photo.entryDate] = [];
    }
    acc[photo.entryDate].push(photo);
    return acc;
  }, {} as Record<string, PhotoItem[]>);

  return (
    <>
      <ScrollArea className="h-[60vh]">
        <div className="space-y-6 p-1">
          {Object.entries(photosByDate).map(([date, photos]) => (
            <div key={date}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {format(new Date(date), 'd. MMMM yyyy', { locale: cs })}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, idx) => (
                  <Card
                    key={`${photo.entryId}-${photo.photoIndex}`}
                    className="relative aspect-square overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(photo)}
                  >
                    <img
                      src={photo.photoUrl}
                      alt={`Foto z ${format(new Date(date), 'd.M.yyyy')}`}
                      className="w-full h-full object-cover"
                    />
                    {onDeletePhoto && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePhoto(photo.entryId, photo.photoIndex);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Lightbox */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => closeLightbox()}>
        <DialogContent 
          className="max-w-4xl p-0 bg-background/95 backdrop-blur"
          onKeyDown={handleKeyDown}
        >
          <DialogHeader className="absolute top-4 left-4 z-10">
            <DialogTitle className="text-sm bg-background/80 px-3 py-1 rounded">
              {selectedPhoto && format(new Date(selectedPhoto.entryDate), 'd. MMMM yyyy', { locale: cs })}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="relative">
              <img
                src={selectedPhoto.photoUrl}
                alt="Fotografie"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Navigation */}
              {lightboxIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}
              
              {lightboxIndex < allPhotos.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}
              
              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded text-sm">
                {lightboxIndex + 1} / {allPhotos.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
