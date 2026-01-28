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
import { MergeOutputFormat } from 'yt-dlp-command-builder';

interface MergeOutputFormatModalProps {
  children: React.ReactNode;
  defaultValue: MergeOutputFormat | undefined;
  onSelect: (val: MergeOutputFormat) => void;
}

const MergeOutputFormatModal = ({
  children,
  defaultValue,
  onSelect
}: MergeOutputFormatModalProps) => {
  const allowedOutputFormats: MergeOutputFormat[] = ['avi', 'flv', 'mkv', 'mov', 'mp4', 'webm'];
  const [value, setValue] = useState<MergeOutputFormat | undefined>(defaultValue);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-main">Merge output format</DialogTitle>
          <DialogDescription className="font-main flex flex-col gap-2">
            <span>Select format to which the output should be merged</span>
            <p className="bg-yellow-300/20 text-[10px] rounded-md border p-1 px-2 text-foreground font-main">
              This option only controls the container used when separate video and audio streams
              must be merged. It does not force the final format. The actual output container still
              depends on the selected codecs. If the chosen container cannot support the codecs, a
              compatible fallback (usually MKV) will be used.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="merge-output-format-options">
          <RadioGroup value={value} onValueChange={(v) => setValue(v as MergeOutputFormat)}>
            {allowedOutputFormats.map((f: MergeOutputFormat, i) => (
              <div className="flex items-center gap-3" key={i}>
                <RadioGroupItem value={f} id={`mof-${f}`} />
                <Label htmlFor={`mof-${f}`}>{f}</Label>
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

export default MergeOutputFormatModal;
