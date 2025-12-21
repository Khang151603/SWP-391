import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-white text-purple-600 hover:bg-gray-50 shadow-xl',
  secondary: 'bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50',
  outline: 'bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
} as const;

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-10 py-4 text-lg'
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
