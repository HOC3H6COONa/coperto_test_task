import clsx from 'clsx';
import { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className, children, ...props },
  ref,
) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={id} className="text-text text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          className={clsx(
            'bg-surface text-text focus:ring-accent/30 w-full appearance-none rounded-lg border py-2 pr-9 pl-3 text-sm transition-colors outline-none focus:ring-2',
            error ? 'border-accent' : 'border-border focus:border-accent',
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          className="text-muted pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {error && (
        <p className="text-accent text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
