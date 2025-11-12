import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';

const ModeToggle = () => {
  const { setTheme, theme } = useTheme();
  return (
    <Button
      onClick={() => {
        if (theme === 'dark') {
          setTheme('light');
        } else if (theme === 'light') {
          setTheme('dark');
        }
      }}
    >
      {theme === 'light' ? <IconMoon /> : <IconSun />}
    </Button>
  );
};

export default ModeToggle;
