import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    children,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors';
    
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      primary: 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20',
      secondary: 'surface-tertiary text-secondary border border-primary/20',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      outline: 'border border-primary text-primary bg-transparent'
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-sm'
    };

    return (
      <span
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };