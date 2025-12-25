import { cn } from '@renderer/lib/utils';
import { ReactNode } from 'react';

const OptionBlock = ({
  children,
  className,
  name
}: {
  children: ReactNode;
  className?: string;
  name: string;
}) => {
  return (
    <div className={cn('w-full flex flex-col gap-1 m-0', className)}>
      {name && <h1 className="text-xs font-main font-semibold">{name}</h1>}
      <div>{children}</div>
    </div>
  );
};

export default OptionBlock;
