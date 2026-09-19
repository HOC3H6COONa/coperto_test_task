import clsx from 'clsx';
import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'stopped' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success',
  stopped: 'bg-stopped-bg text-accent',
  neutral: 'bg-surface-muted text-muted',
};

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      title={typeof children === 'string' ? children : undefined}
      className={clsx(
        'block w-full truncate rounded-full px-2.5 py-1 text-center text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
