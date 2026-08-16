import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div
        className={cn(
          'rounded-full border-earth-200 border-t-gold-500 animate-spin',
          sizes[size]
        )}
      />
      {text && (
        <p className="text-earth-500 font-medium text-sm tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
