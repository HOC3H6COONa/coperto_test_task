import clsx from 'clsx';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  loadingText?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: 'border border-accent bg-accent text-accent-foreground hover:bg-accent-hover',
  secondary: 'border border-border bg-surface text-text hover:bg-surface-muted',
  ghost:
    'border border-transparent bg-transparent text-muted hover:bg-surface-muted hover:text-text',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', isLoading = false, loadingText, disabled, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {isLoading && <Spinner />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
});
