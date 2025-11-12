import { useEffect, useState } from 'react';
import YtdlpFfmpegConfirmModal from './components/ytdlp-ffmpeg-confirm-modal';
import { Spinner } from './components/ui/spinner';
import { type AppSettings } from '@/shared/types';
import { useSettingsStore } from './stores/settings-store';

const App = () => {
  const [loadingFromSettings, setLoadingFromSettings] = useState(true);
  const [isYtdlpFmpegConfirmModalVisible, setIsYtdlpFfmpegConfirmModalVisible] = useState(false);
  const setSettings = useSettingsStore((state) => state.setSettings);

  useEffect(() => {
    window.api.rendererInit().then((settings: AppSettings) => {
      setLoadingFromSettings(false);
      setSettings(settings);

      const isYtdlpMissing = !settings.ytdlpPath || !settings.ytdlpVersion;
      const isFfmpegMissing = !settings.ffmpegPath || !settings.ffmpegVersion;

      if (isYtdlpMissing || isFfmpegMissing) {
        setIsYtdlpFfmpegConfirmModalVisible(true);
      }
    });
  }, [setSettings]);

  const handleCloseModal = () => {
    setIsYtdlpFfmpegConfirmModalVisible(false);
  };

  if (loadingFromSettings) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex justify-center items-center font-inter">App</div>
      {isYtdlpFmpegConfirmModalVisible ? (
        <YtdlpFfmpegConfirmModal
          open={isYtdlpFmpegConfirmModalVisible}
          onOpenChange={handleCloseModal}
        />
      ) : null}
    </>
  );
};

export default App;
