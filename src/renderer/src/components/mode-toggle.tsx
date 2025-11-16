import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';

const ModeToggle = () => {
  const { setTheme, theme } = useTheme();
  return (
    <Button
      variant={'default'}
      className="size-6 bg-black hover:bg-white/20"
      onClick={() => {
        if (theme === 'dark') {
          setTheme('light');
        } else if (theme === 'light') {
          setTheme('dark');
        }
      }}
    >
      {theme === 'light' ? <IconMoon className="opacity-60" /> : <IconSun className="opacity-60" />}
    </Button>
  );
};

export default ModeToggle;
