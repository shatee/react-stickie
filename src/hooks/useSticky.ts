import {
  RefObject,
  useCallback,
  useState,
  CSSProperties,
  useEffect,
} from 'react';
import { useUiEvent } from './useUiEvent';
import throttle from 'lodash.throttle';

const TIMEOUT = 20;

const px2num = (px: string | number | undefined) =>
  typeof px === 'string' ? parseFloat(px) : px || 0;

/**
 * hooks function of create style like sticky for legacy browser
 */
export const useSticky = (
  ref: RefObject<HTMLDivElement>,
  parent: HTMLElement | null,
  overflowRoot: HTMLElement | null,
  positionRoot: HTMLElement | null,
  top: number | undefined,
  bottom: number | undefined,
) => {
  const [style, setStyle] = useState<CSSProperties>();

  // stick on parent at stucked
  const [isStuck, setStuck] = useState(false);

  const onScroll = useCallback(
    throttle(() => {
      if (!ref.current || !parent) {
        setStyle(undefined);
        return;
      }

      const targetRect = ref.current.getBoundingClientRect();
      const contentStyle = getComputedStyle(ref.current.children[0]);
      const parentRect = parent?.getBoundingClientRect();
      const overflowRootRect = overflowRoot?.getBoundingClientRect() || {
        top: 0,
        bottom: window.innerHeight,
      };
      const absoluteOrFixedRootRect = positionRoot?.getBoundingClientRect() || {
        top: 0,
        left: 0,
      };

      const height = targetRect.height;
      const width = targetRect.width;

      const overflowRootStyle = overflowRoot
        ? getComputedStyle(overflowRoot)
        : null;

      const stickyAreaRect = {
        top:
          (overflowRoot
            ? overflowRootRect.top +
              px2num(overflowRootStyle!.paddingTop) +
              px2num(overflowRootStyle!.borderTopWidth)
            : 0) + (top || 0),
        bottom:
          (overflowRoot
            ? overflowRootRect.bottom -
              px2num(overflowRootStyle!.paddingTop) -
              px2num(overflowRootStyle!.borderBottomWidth)
            : window.innerHeight) - (bottom || 0),
      };

      if (top !== undefined) {
        // top stuck (stick to parent bottom)
        if (
          parentRect.bottom - height - px2num(contentStyle.marginTop) <
          stickyAreaRect.top
        ) {
          setStyle({
            position: 'absolute',
            left: `${targetRect.left - parentRect.left}px`,
            bottom: `-${px2num(contentStyle.marginBottom)}px`,
            width: `${width}px`,
          });
          setStuck(true);
          return;
        }

        // top sticky (stick to absoluteOrFixedRoot top)
        if (
          targetRect.top - px2num(contentStyle.marginTop) <=
          stickyAreaRect.top
        ) {
          setStyle({
            position: overflowRoot ? 'absolute' : 'fixed',
            left: `${overflowRoot ? -absoluteOrFixedRootRect.left : 0}px`,
            top: `${
              stickyAreaRect.top +
              px2num(contentStyle.marginTop) -
              (overflowRoot ? absoluteOrFixedRootRect.top : 0)
            }px`,
            transform: `translate(${
              targetRect.left + (positionRoot ? 0 : pageXOffset)
            }px, ${positionRoot ? 0 : pageYOffset}px)`,
            width: `${width}px`,
          });
          setStuck(false);
          return;
        }
      }

      if (bottom !== undefined) {
        // bottom stuck (stick to parent top)
        if (
          parentRect.top +
            height +
            px2num(contentStyle.marginTop) +
            px2num(contentStyle.marginBottom) >
          stickyAreaRect.bottom
        ) {
          setStyle({
            position: 'absolute',
            left: `${targetRect.left - parentRect.left}px`,
            top: `${-px2num(contentStyle.marginTop)}px`,
            width: `${width}px`,
          });
          setStuck(true);
          return;
        }

        // bottom sticky (stick to absoluteOrFixedRoot bottom)
        if (
          targetRect.bottom + px2num(contentStyle.marginBottom) >=
          stickyAreaRect.bottom
        ) {
          setStyle({
            position: overflowRoot ? 'absolute' : 'fixed',
            left: `${overflowRoot ? -absoluteOrFixedRootRect.left : 0}px`,
            top: `${
              stickyAreaRect.bottom -
              targetRect.height -
              px2num(contentStyle.marginTop) -
              px2num(contentStyle.marginBottom) -
              (overflowRoot ? absoluteOrFixedRootRect.top : 0)
            }px`,
            transform: `translate(${
              targetRect.left + (positionRoot ? 0 : pageXOffset)
            }px, ${positionRoot ? 0 : pageYOffset}px)`,
            width: `${width}px`,
          });
          setStuck(false);
          return;
        }
      }

      // release sticky
      setStyle(undefined);
      setStuck(false);
    }, TIMEOUT),
    [ref.current, parent, overflowRoot, positionRoot, top, bottom],
  );

  // fire scroll at first
  useEffect(() => onScroll(), [ref.current]);

  useUiEvent(overflowRoot, 'scroll', onScroll);
  useUiEvent(window, 'scroll', onScroll);
  useUiEvent(window, 'resize', onScroll);

  return { style, isStuck };
};
