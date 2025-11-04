import { useEffect, useState } from 'react'
import YtdlpFfmpegConfirmModal from './components/ytdlp-ffmpeg-confirm-modal'
import { Spinner } from './components/ui/spinner'

const App = () => {
  const [loadingFromSettings, setLoadingFromSettings] = useState(true)
  const [isYtdlpFmpegConfirmModalVisible, setIsYtdlpFfmpegConfirmModalVisible] = useState(false)

  useEffect(() => {
    window.api.rendererInit().then(({ ytdlpPath, ytdlpVersion, ffmpegPath, ffmpegVersion }) => {
      setLoadingFromSettings(false)

      if (!ytdlpPath && !ytdlpVersion && !ffmpegPath && !ffmpegVersion) {
        setIsYtdlpFfmpegConfirmModalVisible(true)
      }
    })
  }, [])

  const handleCloseModal = () => {
    setIsYtdlpFfmpegConfirmModalVisible(false)
  }

  if (loadingFromSettings) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <div className="h-screen flex justify-center items-center text-4xl">
      App
      {isYtdlpFmpegConfirmModalVisible ? (
        <YtdlpFfmpegConfirmModal
          open={isYtdlpFmpegConfirmModalVisible}
          onOpenChange={handleCloseModal}
        />
      ) : null}
    </div>
  )
}

export default App
