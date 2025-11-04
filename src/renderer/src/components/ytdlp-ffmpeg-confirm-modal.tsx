import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@renderer/components/ui/alert-dialog'
import { IconCheck, IconDownload } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Spinner } from './ui/spinner'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

type YtdlpFfmpegConfirmModalProps = {
  open: boolean
  onOpenChange: () => void
}

type ConfirmYtdlpProps = {
  isYtdlpConfirmLoading: boolean
  isYtdlpPresentInPc: boolean
  version: string
}

type ConfirmFfmpegProps = {
  isFfmpegConfirmLoading: boolean
  isFfmpegPresentInPc: boolean
  version: string
}

const ConfirmYtdlp = ({
  isYtdlpConfirmLoading,
  isYtdlpPresentInPc,
  version
}: ConfirmYtdlpProps) => {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="left flex flex-col gap-1">
        <span className="text-sm">yt-dlp</span>
        <Badge className="text-xs">Version: {isYtdlpPresentInPc ? version : 'Not Found'}</Badge>
      </div>
      <div className="right">
        {isYtdlpConfirmLoading ? (
          <Spinner />
        ) : isYtdlpPresentInPc ? (
          <IconCheck />
        ) : (
          <Button>
            <IconDownload />
          </Button>
        )}
      </div>
    </div>
  )
}

const ConfirmFfmpeg = ({
  isFfmpegConfirmLoading,
  isFfmpegPresentInPc,
  version
}: ConfirmFfmpegProps) => {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="left flex flex-col gap-1">
        <span className="text-sm">ffmpeg</span>
        <Badge className="text-xs">Version: {isFfmpegPresentInPc ? version : 'Not Found'}</Badge>
      </div>
      <div className="right">
        {isFfmpegConfirmLoading ? (
          <Spinner />
        ) : isFfmpegPresentInPc ? (
          <IconCheck />
        ) : (
          <Button>
            <IconDownload />
          </Button>
        )}
      </div>
    </div>
  )
}

const YtdlpFfmpegConfirmModal = ({ open, onOpenChange }: YtdlpFfmpegConfirmModalProps) => {
  const [isYtdlpPresentInPc, setIsYtdlpPresentInPc] = useState(false)
  const [isFfmpegPresentInPc, setIsFfmpegPresentInPc] = useState(false)
  const [isYtdlpConfirmLoading, setIsYtdlpConfirmLoading] = useState(true)
  const [isFfmpegConfirmLoading, setIsFfmpegConfirmLoading] = useState(true)
  const [ytdlpVersion, setYtdlpVersion] = useState('')
  const [ffmpegVersion, setFfmpegVersion] = useState('')

  useEffect(() => {
    window.api.confirmYtdlp().then(({ ytdlpPathInPc, ytdlpVersionInPc }) => {
      if (ytdlpPathInPc && ytdlpVersionInPc) {
        setIsYtdlpPresentInPc(true)
        setYtdlpVersion(String(ytdlpVersionInPc))
      } else {
        setIsYtdlpPresentInPc(false)
        setYtdlpVersion('')
      }
      setIsYtdlpConfirmLoading(false)
    })
  }, [])

  useEffect(() => {
    window.api.confirmFfmpeg().then(({ ffmpegPathInPc, ffmpegVersionInPc }) => {
      if (ffmpegPathInPc && ffmpegVersionInPc) {
        setIsFfmpegPresentInPc(true)
        setFfmpegVersion(String(ffmpegVersionInPc))
      } else {
        setIsFfmpegPresentInPc(false)
        setFfmpegVersion('')
      }
      setIsFfmpegConfirmLoading(false)
    })
  }, [])

  const disableContinue =
    isYtdlpConfirmLoading ||
    isFfmpegConfirmLoading ||
    ytdlpVersion.length === 0 ||
    ffmpegVersion.length === 0

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Checking yt-dlp and ffmpeg</AlertDialogTitle>
            <AlertDialogDescription>
              Checking yt-dlp and ffmpeg existence in your PC
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div id="yt-dlp-ffmpeg-confirm" className="flex flex-col">
            <ConfirmYtdlp
              isYtdlpConfirmLoading={isYtdlpConfirmLoading}
              isYtdlpPresentInPc={isYtdlpPresentInPc}
              version={ytdlpVersion}
            />
            <hr className="w-full m-2 my-4" />
            <ConfirmFfmpeg
              isFfmpegConfirmLoading={isFfmpegConfirmLoading}
              isFfmpegPresentInPc={isFfmpegPresentInPc}
              version={ffmpegVersion}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogAction disabled={disableContinue}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default YtdlpFfmpegConfirmModal
