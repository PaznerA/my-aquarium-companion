import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { WikiInfoModal } from './WikiInfoModal';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/lib/i18n';

interface WikiInfoButtonProps {
  scientificName?: string;
  commonNameEn?: string;
  commonNameCs?: string;
  displayName: string;
  size?: 'sm' | 'default';
}

export const WikiInfoButton = ({
  scientificName,
  commonNameEn,
  commonNameCs,
  displayName,
  size = 'default',
}: WikiInfoButtonProps) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'}
            onClick={handleClick}
          >
            <Globe className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t.wiki.lookupInfo}
        </TooltipContent>
      </Tooltip>

      <WikiInfoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scientificName={scientificName}
        commonNameEn={commonNameEn}
        commonNameCs={commonNameCs}
        displayName={displayName}
      />
    </>
  );
};
