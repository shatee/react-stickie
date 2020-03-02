import { RefObject, useCallback, useState, CSSProperties, useEffect } from 'react';
import { useUiEvent } from './useUiEvent';
import throttle from 'lodash.throttle';

const px2num = (px: string | number | undefined) => typeof px === 'string' ? parseFloat(px) : px || 0;

/**
 * hooks function of create style like sticky for legacy browser
 */
export const useSticky = (
  ref: RefObject<HTMLDivElement>,
  parent: HTMLElement | null,
  positionRoot: HTMLElement | null,
  overflowRoot: HTMLElement | null,
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
    const positionRootRect = positionRoot?.getBoundingClientRect() || { top: 0, left: 0, bottom: 0 };
    const overflowRootRect = overflowRoot?.getBoundingClientRect() || { top: 0, bottom: 0 };

    const height = targetRect.height;
    const width = targetRect.width;

    const overflowRootStyle = overflowRoot ? getComputedStyle(overflowRoot) : null;
    const overflowRootBorderTop = overflowRootStyle ? px2num(overflowRootStyle.borderTopWidth) : 0;
    const overflowRootBorderBottom = overflowRootStyle ? px2num(overflowRootStyle.borderBottomWidth) : 0;

    // top stuck (stick to parent bottom)
    if (top !== undefined && parentRect.bottom - top - overflowRootBorderTop - height < positionRootRect.top) {
      setStyle({
        position: 'absolute',
        left: `${targetRect.left - parentRect.left}px`,
        bottom: `-${px2num(contentStyle.marginBottom)}px`,
        width: `${width}px`
      });
      setStuck(true);
      return;
    }

    // top sticky (stick to positionRoot top)
    if (top !== undefined && targetRect.top - top - overflowRootBorderTop <= positionRootRect.top) {
      setStyle({
        position: 'absolute',
        left: `${targetRect.left - positionRootRect.left}px`,
        top: `${positionRootRect.top - overflowRootRect.top + top + overflowRootBorderTop - px2num(contentStyle.marginTop)}px`,
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

    // bottom sticky (stick to positionRoot bottom)
    if (bottom !== undefined && targetRect.bottom + bottom + overflowRootBorderBottom - 0 >= positionRootRect.bottom) {
      setStyle({
        position: 'absolute',
        left: `${targetRect.left - positionRootRect.left}px`,
        bottom: `${positionRootRect.bottom - overflowRootRect.bottom + bottom + overflowRootBorderBottom - px2num(contentStyle.marginBottom)}px`,
        width: `${width}px`
      });
      setStuck(false);
      return;
    }

    // release sticky
    setStyle(undefined);
    setStuck(false);
  }, 50), [ref.current, parent, positionRoot, overflowRoot, top, bottom]);

  // fire scroll at first
  useEffect(() => onScroll(), [ref.current]);

  useUiEvent(overflowRoot, 'scroll', onScroll);
  useUiEvent(window, 'scroll', onScroll);
  useUiEvent(window, 'resize', onScroll);

  return { style, isStuck };
};
