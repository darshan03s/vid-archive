import { SaveSettingsButton } from './save-settings-button';

export const SettingsHeader = () => {
  return (
    <div className="px-3 py-2 h-12 text-sm flex items-center justify-between sticky top-0 left-0 bg-background/60 backdrop-blur-md text-foreground z-49">
      <span className="text-xs font-main font-semibold">Settings</span>
      <SaveSettingsButton />
    </div>
  );
};
