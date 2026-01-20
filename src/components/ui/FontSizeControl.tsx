import { useEffect, useState } from 'react';
import Button from './Button';
import { IconTextSize } from '../icons';
import './FontSizeControl.css';

const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20];
const DEFAULT_FONT_SIZE = 14;
const STORAGE_KEY = 'ap-catalog-font-size';

export default function FontSizeControl() {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_FONT_SIZE;
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-base', `${fontSize}px`);
    localStorage.setItem(STORAGE_KEY, fontSize.toString());
  }, [fontSize]);

  const decrease = () => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(FONT_SIZES[currentIndex - 1]);
    }
  };

  const increase = () => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    if (currentIndex < FONT_SIZES.length - 1) {
      setFontSize(FONT_SIZES[currentIndex + 1]);
    }
  };

  const reset = () => {
    setFontSize(DEFAULT_FONT_SIZE);
  };

  const currentIndex = FONT_SIZES.indexOf(fontSize);
  const canDecrease = currentIndex > 0;
  const canIncrease = currentIndex < FONT_SIZES.length - 1;

  return (
    <div className="font-size-control">
      <Button
        size="sm"
        variant="ghost"
        onClick={decrease}
        disabled={!canDecrease}
        aria-label="Decrease font size"
        title="Reduce text size"
      >
        A−
      </Button>
      <Button
        size="sm"
        variant="ghost"
        icon={<IconTextSize size={16} />}
        onClick={reset}
        aria-label="Reset font size"
        title="Reset to default"
      />
      <Button
        size="sm"
        variant="ghost"
        onClick={increase}
        disabled={!canIncrease}
        aria-label="Increase font size"
        title="Increase text size"
      >
        A+
      </Button>
    </div>
  );
}
