import { cn } from '@renderer/lib/utils';
import { ReactNode } from 'react';

export const SettingsBlock = ({
  children,
  className,
  name
}: {
  children: ReactNode;
  className?: string;
  name?: string;
}) => {
  return (
    <div className={cn('settings-block w-full flex flex-col gap-1 m-0', className)}>
      {name && <h1 className="text-sm font-bold">{name}</h1>}
      <div className="space-y-4">{children}</div>
    </div>
  );
};
