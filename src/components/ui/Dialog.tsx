import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

// Ensure overlay sits above page UI but below dialog content (z-50)
const dialogOverlayStyles = 'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0';

export const DialogOverlay = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(dialogOverlayStyles, className)}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

const dialogContentStyles = 'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95';

export const DialogContent = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentStyles, className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = 'DialogContent';

export const DialogHeader = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn('mb-6', className)}>
    {children}
  </div>
);

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  DialogPrimitive.DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-2xl font-bold text-gray-900 mb-2', className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogPrimitive.DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-gray-600', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';
