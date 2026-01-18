import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Globe, Plus, X, Fish, Leaf } from 'lucide-react';

interface WikipediaPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  type: 'fish' | 'plant';
  data: {
    en: string[];
    cs: string[];
    scientificName?: string;
    description?: { en: string; cs: string };
    thumbnail?: string;
  } | null;
  language: 'cs' | 'en';
}

export const WikipediaPreview = ({
  isOpen,
  onClose,
  onAdd,
  type,
  data,
  language,
}: WikipediaPreviewProps) => {
  if (!data) return null;

  const Icon = type === 'fish' ? Fish : Leaf;
  const primaryName = data.en[0] || data.cs[0] || '';
  
  const texts = {
    title: language === 'cs' ? 'Náhled z Wikipedie' : 'Wikipedia Preview',
    add: language === 'cs' ? 'Přidat do lexikonu' : 'Add to Lexicon',
    cancel: language === 'cs' ? 'Zrušit' : 'Cancel',
    scientificName: language === 'cs' ? 'Vědecký název' : 'Scientific Name',
    englishNames: language === 'cs' ? 'Anglické názvy' : 'English Names',
    czechNames: language === 'cs' ? 'České názvy' : 'Czech Names',
    description: language === 'cs' ? 'Popis' : 'Description',
    noDescription: language === 'cs' ? 'Popis není k dispozici' : 'No description available',
    source: language === 'cs' ? 'Zdroj: Wikipedia' : 'Source: Wikipedia',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {texts.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {texts.title}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 pr-4">
            {/* Header with image */}
            <div className="flex gap-4">
              {data.thumbnail ? (
                <img
                  src={data.thumbnail}
                  alt={primaryName}
                  className="w-24 h-24 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate">{primaryName}</h3>
                {data.scientificName && (
                  <p className="text-sm text-muted-foreground italic">
                    {data.scientificName}
                  </p>
                )}
                <Badge variant="secondary" className="mt-2 gap-1">
                  <Globe className="h-3 w-3" />
                  Wikipedia
                </Badge>
              </div>
            </div>

            {/* English names */}
            {data.en.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                  {texts.englishNames}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {data.en.map((name, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Czech names */}
            {data.cs.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                  {texts.czechNames}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {data.cs.map((name, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1.5">
                {texts.description}
              </h4>
              <div className="text-sm space-y-2">
                {data.description?.en && (
                  <p className="text-foreground">
                    <span className="text-xs text-muted-foreground mr-1">EN:</span>
                    {data.description.en}
                  </p>
                )}
                {data.description?.cs && (
                  <p className="text-foreground">
                    <span className="text-xs text-muted-foreground mr-1">CZ:</span>
                    {data.description.cs}
                  </p>
                )}
                {!data.description?.en && !data.description?.cs && (
                  <p className="text-muted-foreground italic">{texts.noDescription}</p>
                )}
              </div>
            </div>

            {/* Source note */}
            <p className="text-xs text-muted-foreground pt-2 border-t">
              {texts.source}
            </p>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            {texts.cancel}
          </Button>
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            {texts.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
