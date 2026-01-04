import { cn } from '@renderer/lib/utils';
import { ReactNode } from 'react';

export const SettingName = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn('setting-name text-[12px] text-nowrap font-semibold font-main', className)}>
      {children}
    </span>
  );
};
