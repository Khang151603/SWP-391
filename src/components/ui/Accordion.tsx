import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { forwardRef } from 'react';
import { cn } from '../utils/cn';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-gray-200', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const accordionTriggerStyles = 'flex flex-1 items-center justify-between py-5 font-semibold text-lg text-gray-900 transition-all hover:text-purple-600 data-[state=open]:text-purple-600';

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionPrimitive.AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(accordionTriggerStyles, className)}
      {...props}
    >
      {children}
      <svg
        className="h-5 w-5 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

const accordionContentStyles = 'overflow-hidden text-gray-600 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down';

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={accordionContentStyles}
    {...props}
  >
    <div className={cn('pb-5 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';
