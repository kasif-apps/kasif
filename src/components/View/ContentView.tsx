import { useCaptureField, useCapture } from '@kasif/util/capture-react';
import { useEffect } from 'react';

export function ContentView() {
  const { onCaptureEnd, onCaptureStart, onCaptureTick, setSource } = useCaptureField();

  const { ref } = useCapture<HTMLDivElement>({
    onCaptureStart,
    onCaptureEnd,
    onCaptureTick,
    constrain: true,
  });

  useEffect(() => {
    setSource(ref.current);
  }, [ref.current]);

  return <div>content view</div>;
}
