import React, { useLayoutEffect, useRef, useMemo, CSSProperties } from 'react';
import { StickyProps } from './StickyProps';
import { closestBy } from './utils/closestBy';
import { isOverflowRoot } from './utils/isOverflowRoot';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';

/**
 * sticky wrapper
 */
export const StickySupports = ({ className, top, bottom, onChange, children }: StickyProps): React.ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const root = useMemo(() => {
    if (!ref.current) return null;
    const root = closestBy(isOverflowRoot, ref.current);
    // body だったら null にして viewport を対象とする
    return root !== document.body ? root : null;
  }, [ref.current]);

  const entry = useIntersectionObserver(
    ref,
    {
      threshold: 1,
      root,
      rootMargin: [
        `${typeof top === 'number'? -top - 1 : 9999}px`, // 雑、本来は ref.current.offsetHeight を指定する
        `${document.body.offsetWidth}px`,
        `${typeof bottom === 'number' ? -bottom - 1 : 9999}px`, // 雑、本来は ref.current.offsetHeight を指定する
        `${document.body.offsetWidth}px`
      ].join(' ')
    }
  );

  const isStick = useMemo(() => {
    return !!(entry && entry.intersectionRatio < 1);
    entry?.boundingClientRect
  }, [entry?.intersectionRatio]);

  const style = useMemo((): CSSProperties => ({
    position: 'sticky',
    top: typeof top === 'number' ? `${top}px` : undefined,
    bottom: typeof bottom === 'number' ? `${bottom}px` : undefined,
    padding: `${typeof top === 'number' ? 1 : 0}px 0 ${typeof bottom === 'number' ? 1 : 0}px`,
    margin: `${typeof bottom === 'number' ? -1 : 0}px 0 ${typeof top === 'number' ? -1 : 0}px`,
    transform: !isStick ? `translateY(${typeof top === 'number' ? -1 : 1}px)` : undefined
  }), [top, bottom]);

  // call onChange after changed isStick
  useLayoutEffect(() => {
    if (ref.current && onChange) onChange(isStick);
  }, [isStick]);

  return (
    <div className={className} ref={ref} style={style}>
      {children}
    </div>
  )
};
