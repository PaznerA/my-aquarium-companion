import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { fetchWikipediaInfo, type WikipediaResult } from '@/lib/wikipedia';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, AlertCircle, Globe } from 'lucide-react';

interface WikiInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  scientificName?: string;
  commonNameEn?: string;
  commonNameCs?: string;
  displayName: string;
}

export const WikiInfoModal = ({
  isOpen,
  onClose,
  scientificName,
  commonNameEn,
  commonNameCs,
  displayName,
}: WikiInfoModalProps) => {
  const { t, language } = useI18n();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WikipediaResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !data && !loading) {
      loadWikipediaData();
    }
  }, [isOpen]);

  const loadWikipediaData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchWikipediaInfo(scientificName, commonNameEn, commonNameCs);
      
      if (result.found && result.data) {
        setData(result.data);
      } else {
        setError(result.error || t.wiki.notFound);
      }
    } catch (err) {
      console.error('Wikipedia fetch error:', err);
      setError(t.wiki.fetchError);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setData(null);
      setError(null);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-2 max-w-lg max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {displayName}
          </DialogTitle>
          {scientificName && (
            <p className="text-sm text-muted-foreground italic">{scientificName}</p>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          {loading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={loadWikipediaData}>
                {t.wiki.tryAgain}
              </Button>
            </div>
          ) : data ? (
            <div className="space-y-4 py-4">
              {/* Thumbnail */}
              {data.thumbnail && (
                <div className="relative overflow-hidden rounded-lg bg-muted">
                  <img
                    src={data.originalimage?.source || data.thumbnail.source}
                    alt={data.title}
                    className="w-full h-auto max-h-60 object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Description badge */}
              {data.description && (
                <p className="text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-block">
                  {data.description}
                </p>
              )}

              {/* Extract */}
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="leading-relaxed">{data.extract}</p>
              </div>

              {/* Wikipedia link */}
              {data.content_urls?.desktop?.page && (
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-2"
                    onClick={() => window.open(data.content_urls?.desktop?.page, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t.wiki.readMore}
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
