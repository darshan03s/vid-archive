import { buttonVariants } from '@renderer/components/ui/button';
import { cn } from '@renderer/lib/utils';
import { IconDownload, IconHome } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDownloads = location.pathname === '/downloads';

  return (
    <section className="sidebar bg-background w-12 overflow-hidden py-1 flex flex-col items-center gap-3">
      <Link
        to={'/'}
        title="Home"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
          `${isHome ? 'bg-muted' : ''}`
        )}
      >
        <IconHome />
      </Link>
      <Link
        to={'/downloads'}
        title="Downloads"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
          `${isDownloads ? 'bg-muted' : ''}`
        )}
      >
        <IconDownload />
      </Link>
    </section>
  );
};

export default Sidebar;
