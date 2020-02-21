import React, { useLayoutEffect, useRef, useMemo, CSSProperties } from 'react';
import { StickyProps } from './StickyProps';
import { closestBy } from './utils/closestBy';
import { isOverflowRoot } from './utils/isOverflowRoot';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';

/**
 * sticky wrapper
 */
export const StickySupports = ({ top, bottom, onChange, children }: StickyProps): React.ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const root = useMemo(() => ref.current ? closestBy(isOverflowRoot, ref.current) : null, [ref.current]);

  const entry = useIntersectionObserver(ref, { threshold: 1, root, rootMargin: `${-(top || 0) - 1}px 0px ${-(bottom || 0)}px 0px` });

  const isStick = useMemo(() => {
    return !!(entry && entry.intersectionRatio < 1);
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
    <div ref={ref} style={style}>
      {children}
    </div>
  )
};
