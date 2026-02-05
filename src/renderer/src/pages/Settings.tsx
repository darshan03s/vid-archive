import { useSettingsStore } from '@renderer/stores/settings-store';
import { useEffect } from 'react';
import { SettingsHeader } from './components/settings';
import { SettingsBlocks } from './components/settings';

const Settings = () => {
  const currentSettings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    useSettingsStore.getState().setSettingsChange(currentSettings);
  }, [currentSettings]);

  return (
    <div className="w-full lg:max-w-6xl lg:mx-auto flex flex-col gap-1">
      <SettingsHeader />
      <SettingsBlocks />
    </div>
  );
};

export default Settings;
