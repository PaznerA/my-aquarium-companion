import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  label: string;
  children?: ReactNode;
  className?: string;
  // Shorthand for simple text inputs
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  step?: string;
  required?: boolean;
  labelClassName?: string;
}

export const FormField = ({ 
  label, 
  children,
  className = '',
  value,
  onChange,
  type = 'text',
  placeholder,
  step,
  required,
  labelClassName = '',
}: FormFieldProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className={labelClassName}>{label}</Label>
      {children || (
        <Input
          type={type}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          step={step}
          required={required}
          className="border-2"
        />
      )}
    </div>
  );
};
