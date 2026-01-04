import { cn } from '@renderer/lib/utils';
import { ReactNode } from 'react';

export const SettingsStaticValue = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn('h-8 w-[400px] text-[12px] flex items-center', className)}>{children}</span>
  );
};
