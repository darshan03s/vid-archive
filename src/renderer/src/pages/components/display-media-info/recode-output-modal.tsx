import { Button } from '@renderer/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog';
import { Label } from '@renderer/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@renderer/components/ui/radio-group';
import { useState } from 'react';
import { RemuxRecodeVideoFormat } from 'yt-dlp-command-builder';

interface RecodeOutputModalProps {
  children: React.ReactNode;
  defaultValue: RemuxRecodeVideoFormat | undefined;
  onSelect: (val: RemuxRecodeVideoFormat) => void;
}

const RecodeOutputModal = ({ children, defaultValue, onSelect }: RecodeOutputModalProps) => {
  const allowedRecodeFormats: RemuxRecodeVideoFormat[] = [
    'aac',
    'aiff',
    'alac',
    'avi',
    'flac',
    'flv',
    'gif',
    'm4a',
    'mka',
    'mkv',
    'mov',
    'mp3',
    'mp4',
    'ogg',
    'opus',
    'vorbis',
    'wav',
    'webm'
  ];

  const [value, setValue] = useState<RemuxRecodeVideoFormat | undefined>(defaultValue);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-main">Recode media</DialogTitle>
          <DialogDescription className="font-main flex flex-col gap-2">
            Convert the output into a different format. This may re-encode media, increasing
            processing time and reducing quality.
          </DialogDescription>
        </DialogHeader>
        <div className="recode-media-options h-[190px] overflow-y-auto">
          <RadioGroup value={value} onValueChange={(v) => setValue(v as RemuxRecodeVideoFormat)}>
            {allowedRecodeFormats.map((f: RemuxRecodeVideoFormat, i) => (
              <div className="flex items-center gap-3" key={i}>
                <RadioGroupItem value={f} id={`rm-${f}`} />
                <Label htmlFor={`rm-${f}`}>{f}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button disabled={!value} onClick={() => onSelect(value!)}>
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecodeOutputModal;
