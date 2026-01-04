import { cn } from '@renderer/lib/utils';
import { ReactNode } from 'react';

export const SettingsItem = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={cn('flex items-center justify-between', className)}>{children}</div>;
};
