import { useEffect, useRef } from 'react';

export function AutoScrollTextarea({
  value,
  className,
  ...props
}: {
  value: string;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [value]);

  return <textarea ref={ref} value={value} className={className} {...props} />;
}
