import { useState, KeyboardEvent, useRef } from 'react';
import { X } from 'lucide-react';
import { Input } from './input';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface ChipsInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const ChipsInput = ({ 
  value = [], 
  onChange, 
  placeholder, 
  className,
  disabled = false
}: ChipsInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addChip();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Remove last chip when backspace on empty input
      onChange(value.slice(0, -1));
    }
  };

  const addChip = () => {
    const trimmed = inputValue.trim().replace(/,$/g, '');
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const removeChip = (index: number) => {
    if (disabled) return;
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addChip();
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-wrap gap-1.5 p-2 min-h-10 border-2 rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((chip, index) => (
        <Badge
          key={`${chip}-${index}`}
          variant="secondary"
          className="gap-1 pl-2 pr-1 py-0.5 text-sm"
        >
          {chip}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeChip(index);
              }}
              className="rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? placeholder : ''}
        disabled={disabled}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
    </div>
  );
};
