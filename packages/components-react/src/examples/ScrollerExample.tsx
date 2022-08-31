import { PScroller, PTagDismissible } from '@porsche-design-system/components-react';
import { useCallback, useState } from 'react';

export const ScrollerExamplePage = (): JSX.Element => {
  const style = `
      .scroller > *:not(:last-child) {
        margin-right: 1rem;
      }

      button {
        margin: 0 1rem 1rem 0;
      }
  `;

  type ScrollToPosition = { scrollPosition: number; isSmooth?: boolean };

  const [scrollToPosition, setScrollToPosition] = useState<ScrollToPosition>({ scrollPosition: 220, isSmooth: false });

  const onClick = useCallback((scrollPosition: number) => {
    setScrollToPosition({ scrollPosition: scrollPosition, isSmooth: true });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: style }} />

      <button type="button" onClick={onClick(0)}>
        Scroll to start
      </button>
      <button type="button" onClick={onClick(220)}>
        Scroll to middle
      </button>
      <button type="button" onClick={onClick(720)}>
        Scroll to end
      </button>

      <div style={{ maxWidth: '400px', whiteSpace: 'nowrap' }}>
        <PScroller className="scroller" scrollToPosition={scrollToPosition}>
          <PTagDismissible>START - some tag content</PTagDismissible>
          <PTagDismissible>MIDDLE - some tag content</PTagDismissible>
          <PTagDismissible>END - some tag content</PTagDismissible>
        </PScroller>
      </div>
    </>
  );
};
