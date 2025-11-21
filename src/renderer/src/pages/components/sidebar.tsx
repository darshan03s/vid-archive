import { buttonVariants } from '@renderer/components/ui/button';
import { cn } from '@renderer/lib/utils';
import { IconDownload, IconHome } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <section className="sidebar bg-background w-12 overflow-hidden py-1 flex flex-col items-center gap-3">
      <Link
        to={'/'}
        title="Home"
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
      >
        <IconHome />
      </Link>
      <Link
        to={'/downloads'}
        title="Downloads"
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
      >
        <IconDownload />
      </Link>
    </section>
  );
};

export default Sidebar;
