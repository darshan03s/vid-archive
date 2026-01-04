import { AppSettingsChange } from '@shared/types';
import { useSettingsStore } from '@renderer/stores/settings-store';
import equal from 'fast-deep-equal';
import { Button } from '@renderer/components/ui/button';

export const SaveSettingsButton = () => {
  const currentSettings = useSettingsStore((state) => state.settings);
  const settingsChange = useSettingsStore((state) => state.settingsChange);

  function handleSaveSettings() {
    const changedSettings: AppSettingsChange = {
      downloadsFolder: settingsChange.downloadsFolder!,
      rememberPreviousDownloadsFolder: settingsChange.rememberPreviousDownloadsFolder!,
      cookiesFilePath: settingsChange.cookiesFilePath!,
      maxConcurrentDownloads: settingsChange.maxConcurrentDownloads!,
      cookiesBrowser: settingsChange.cookiesBrowser!,
      cookiesBrowserProfile: settingsChange.cookiesBrowserProfile!
    };

    const currentSettingsState: AppSettingsChange = {
      downloadsFolder: currentSettings.downloadsFolder!,
      rememberPreviousDownloadsFolder: currentSettings.rememberPreviousDownloadsFolder!,
      cookiesFilePath: currentSettings.cookiesFilePath!,
      maxConcurrentDownloads: currentSettings.maxConcurrentDownloads!,
      cookiesBrowser: currentSettings.cookiesBrowser!,
      cookiesBrowserProfile: currentSettings.cookiesBrowserProfile!
    };

    if (equal(currentSettingsState, changedSettings)) return;

    window.api.saveSettings(changedSettings);
  }

  return (
    <Button
      onClick={handleSaveSettings}
      size={'sm'}
      className="text-[10px] h-6 bg-primary text-primary-foreground font-main font-semibold"
    >
      Save Settings
    </Button>
  );
};
