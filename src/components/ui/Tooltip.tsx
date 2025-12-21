import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { forwardRef } from 'react';
import { cn } from '../utils/cn';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipContentStyles = 'z-50 overflow-hidden rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-xl animate-in fade-in-0 zoom-in-95';

export const TooltipContent = forwardRef<
  HTMLDivElement,
  TooltipPrimitive.TooltipContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipContentStyles, className)}
    {...props}
  />
));
TooltipContent.displayName = 'TooltipContent';
