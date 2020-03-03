import { RefObject, useCallback, useState, CSSProperties, useEffect } from 'react';
import { useUiEvent } from './useUiEvent';
import throttle from 'lodash.throttle';

const TIMEOUT = 20;

const px2num = (px: string | number | undefined) => typeof px === 'string' ? parseFloat(px) : px || 0;

/**
 * hooks function of create style like sticky for legacy browser
 */
export const useSticky = (
  ref: RefObject<HTMLDivElement>,
  parent: HTMLElement | null,
  overflowRoot: HTMLElement | null,
  absoluteOrFixedRoot: HTMLElement | null,
  top: number | undefined,
  bottom: number | undefined
) => {
  const [style, setStyle] = useState<CSSProperties>();

  // stick on parent at stucked
  const [isStuck, setStuck] = useState(false);

  const onScroll = useCallback(throttle(() => {
    if (!ref.current || !parent) {
      setStyle(undefined);
      return;
    }

    const targetRect = ref.current.getBoundingClientRect();
    const contentStyle = getComputedStyle(ref.current.children[0]);
    const parentRect = parent?.getBoundingClientRect();
    const overflowRootRect = overflowRoot?.getBoundingClientRect() || { top: 0, bottom: window.innerHeight };
    const absoluteOrFixedRootRect = absoluteOrFixedRoot?.getBoundingClientRect() || { top: 0, left: 0 };

    const height = targetRect.height;
    const width = targetRect.width;

    const overflowRootStyle = overflowRoot ? getComputedStyle(overflowRoot) : null;
    const overflowRootBorderTop = overflowRootStyle ? px2num(overflowRootStyle.borderTopWidth) : 0;
    const overflowRootBorderBottom = overflowRootStyle ? px2num(overflowRootStyle.borderBottomWidth) : 0;

    // top stuck (stick to parent bottom)
    if (top !== undefined && parentRect.bottom - height < overflowRootRect.top + overflowRootBorderTop) {
      setStyle({
        position: 'absolute',
        left: `${targetRect.left - parentRect.left}px`,
        bottom: `-${px2num(contentStyle.marginBottom)}px`,
        width: `${width}px`
      });
      setStuck(true);
      return;
    }

    // top sticky (stick to absoluteOrFixedRoot top)
    if (top !== undefined && targetRect.top - top <= overflowRootRect.top + overflowRootBorderTop) {
      setStyle({
        position: absoluteOrFixedRoot ? 'absolute' : 'fixed',
        left: `${targetRect.left - absoluteOrFixedRootRect.left}px`,
        top: `${top + overflowRootRect.top + overflowRootBorderTop - px2num(contentStyle.marginTop) - absoluteOrFixedRootRect.top}px`,
        width: `${width}px`
      });
      setStuck(false);
      return;
    }

    // bottom stuck (stick to parent top)
    if (bottom !== undefined && parentRect.top + targetRect.height + bottom + overflowRootBorderBottom > overflowRootRect.bottom) {
      setStyle({
        position: 'absolute',
        left: `${targetRect.left - parentRect.left}px`,
        top: `-${px2num(contentStyle.marginTop)}px`,
        width: `${width}px`
      });
      setStuck(true);
      return;
    }

    // bottom sticky (stick to absoluteOrFixedRoot bottom)
    if (bottom !== undefined && targetRect.bottom + bottom >= overflowRootRect.bottom - overflowRootBorderBottom) {
      setStyle({
        position: absoluteOrFixedRoot ? 'absolute' : 'fixed',
        left: `${targetRect.left - absoluteOrFixedRootRect.left}px`,
        top: `${overflowRootRect.bottom - absoluteOrFixedRootRect.top - targetRect.height - bottom - overflowRootBorderBottom + px2num(contentStyle.marginBottom)}px`,
        width: `${width}px`
      });
      setStuck(false);
      return;
    }

    // release sticky
    setStyle(undefined);
    setStuck(false);
  }, TIMEOUT), [ref.current, parent, overflowRoot, absoluteOrFixedRoot, top, bottom]);

  // fire scroll at first
  useEffect(() => onScroll(), [ref.current]);

  useUiEvent(overflowRoot, 'scroll', onScroll);
  useUiEvent(window, 'scroll', onScroll);
  useUiEvent(window, 'resize', onScroll);

  return { style, isStuck };
};
