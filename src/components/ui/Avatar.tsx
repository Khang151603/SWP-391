import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { forwardRef } from 'react';

export const Avatar = forwardRef<
  HTMLSpanElement,
  AvatarPrimitive.AvatarProps
>(({ className = '', ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={`relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  />
));
Avatar.displayName = 'Avatar';

export const AvatarImage = forwardRef<
  HTMLImageElement,
  AvatarPrimitive.AvatarImageProps
>(({ className = '', ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={`aspect-square h-full w-full object-cover ${className}`}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

export const AvatarFallback = forwardRef<
  HTMLSpanElement,
  AvatarPrimitive.AvatarFallbackProps
>(({ className = '', ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold ${className}`}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';
