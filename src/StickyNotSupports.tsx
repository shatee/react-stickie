import React, { useState, useRef, useLayoutEffect, CSSProperties, useMemo } from 'react';
import { StickyProps } from './StickyProps';
import { closestBy } from './utils/closestBy';
import { isOverflowRoot } from './utils/isOverflowRoot';
import { isAbsoluteOrFixed } from './utils/isAbsoluteOrFixed';
import { createPortal } from 'react-dom';
import { useSticky } from './hooks/useSticky';

/**
 * component like sticky.
 * use dom scroll event with window resize event
 */
export const StickyNotSupports = ({ top, bottom, onChange, children }: StickyProps): React.ReactElement => {
  // overflow style root element
  const [overflowRoot, setOverflowRoot] = useState<HTMLElement | null>(null);
  // position: absolute or fixed root element
  const [absoluteOrFixedRoot, setAbsoluteOrFixedRoot] = useState<HTMLElement | null>(null);
  // parent element
  const [parent, setParent] = useState<HTMLElement | null>(null);
  // dummy element for target element at replaced
  const [dummyChildStyle, setDummyChildStyle] = useState<CSSProperties>();

  const ref = useRef<HTMLDivElement>(null);

  const { style, isStuck } = useSticky(ref, parent, overflowRoot, absoluteOrFixedRoot, top, bottom);

  // apply position style to parent element
  useLayoutEffect(() => {
    parent && getComputedStyle(parent).position === 'static' && (parent.style.position = 'relative');
  }, [!parent]);

  // explore closest scroll target root dom, set overflowRoot
  useLayoutEffect(() => {
    const overflowRoot = ref.current ? closestBy(isOverflowRoot, ref.current) : null;
    setOverflowRoot(overflowRoot);
    const positionRootBasis = overflowRoot || ref.current;
    setAbsoluteOrFixedRoot(positionRootBasis ? closestBy(isAbsoluteOrFixed, positionRootBasis) : null);
    setParent(ref.current ? ref.current.parentElement : null);
  }, [ref.current]);

  const isStick = useMemo(() => style?.position === 'absolute' || style?.position === 'fixed', [style?.position]);

  // call onChange after stick state changed.
  useLayoutEffect(() => {
    if (!onChange) return;
    onChange(isStick);
  }, [isStick]);

  // udpate dummy child element style
  useLayoutEffect(() => {
    if (!ref.current || isStick) return;
    const child = ref.current.children[0];
    const childStyle = getComputedStyle(child);
    setDummyChildStyle({
      width: `${child.scrollWidth}px`,
      height: `${child.scrollHeight}px`,
      margin: childStyle.margin
    });
  }, [ref.current, isStick]);

  return (
    <div ref={ref}>
      {
        (style || isStuck)
        ? (
          <>
            <div style={dummyChildStyle} />
            {createPortal(<div style={style}>{children}</div>, (isStuck && parent) || absoluteOrFixedRoot || document.body)}
          </>
        )
        : children
      }
    </div>
  )
};
