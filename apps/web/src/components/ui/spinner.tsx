import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 24, ...props }, ref) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('animate-spin', className)}
      ref={ref}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
);
Spinner.displayName = 'Spinner';

export { Spinner };
