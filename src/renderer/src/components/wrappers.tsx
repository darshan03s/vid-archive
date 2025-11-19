import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '@renderer/lib/utils';

interface TooltipWrapper {
  children: React.ReactNode;
  message: string;
  side?: 'top' | 'right' | 'bottom' | 'left' | undefined;
}

export const TooltipWrapper = ({ message, children, side }: TooltipWrapper) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{message}</TooltipContent>
    </Tooltip>
  );
};

interface AnchorProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const Anchor = ({ href, className, children }: AnchorProps) => {
  return (
    <a href={href} target="__blank" rel="noreferrer" className={cn('underline', className)}>
      {children}
    </a>
  );
};
