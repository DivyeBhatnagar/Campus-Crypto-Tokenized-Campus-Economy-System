import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  className, 
  label,
  error,
  icon,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text/80 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-background border-none outline-none rounded-2xl shadow-neumorphic-inset text-text placeholder-text/50 focus:shadow-neumorphic-inset transition-all duration-200',
            icon ? 'pl-10 pr-4 py-3' : 'px-4 py-3',
            error && 'ring-2 ring-accent/20',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-accent">{error}</p>
      )}
    </div>
  );
};