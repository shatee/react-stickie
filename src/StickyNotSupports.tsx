import React, { useState, useRef, useLayoutEffect, CSSProperties } from 'react';
import { StickyProps } from './StickyProps';
import { closestBy } from './utils/closestBy';
import { isOverflowRoot } from './utils/isOverflowRoot';
import { isAbsoluteRoot } from './utils/isAbsoluteRoot';
import { createPortal } from 'react-dom';
import { useSticky } from './hooks/useSticky';

/**
 * component like sticky.
 * use dom scroll event with window resize event
 */
export const StickyNotSupports = ({ top, bottom, onChange, children }: StickyProps): React.ReactElement => {
  // overflow style root element
  const [overflowRoot, setOverflowRoot] = useState<HTMLElement | null>(null);
  // position style root element
  const [positionRoot, setPositionRoot] = useState<HTMLElement | null>(null);
  // parent element
  const [parent, setParent] = useState<HTMLElement | null>(null);
  // dummy element for target element at replaced
  const [dummyChildStyle, setDummyChildStyle] = useState<CSSProperties>();

  const ref = useRef<HTMLDivElement>(null);

  const { style, isStuck } = useSticky(ref, parent, positionRoot, overflowRoot, top, bottom);

  // apply position style to parent element
  useLayoutEffect(() => {
    parent && getComputedStyle(parent).position === 'static' && (parent.style.position = 'relative');
  }, [!parent]);

  // explore closest scroll target root dom, set overflowRoot
  useLayoutEffect(() => {
    const overflowRoot = ref.current ? closestBy(isOverflowRoot, ref.current) || document.body : null;
    setOverflowRoot(overflowRoot);
    const positionRootBasis = overflowRoot || ref.current;
    setPositionRoot(positionRootBasis ? closestBy(isAbsoluteRoot, positionRootBasis) || document.body : null);
    setParent(ref.current ? ref.current.parentElement : null);
  }, [ref.current]);

  // call onChange after stick state changed.
  useLayoutEffect(() => {
    if (!onChange) return;
    onChange(style?.position === 'absolute');
  }, [style?.position]);

  // udpate dummy child element style
  useLayoutEffect(() => {
    if (!ref.current || style?.position === 'absolute') return;
    const child = ref.current.children[0];
    const childStyle = getComputedStyle(child);
    setDummyChildStyle({
      width: `${child.scrollWidth}px`,
      height: `${child.scrollHeight}px`,
      margin: childStyle.margin
    });
  }, [ref.current, style?.position === 'absolute']);

  return (
    <div ref={ref}>
      {
        (style || isStuck)
        ? (
          <>
            <div style={dummyChildStyle} />
            {createPortal(<div style={style}>{children}</div>, (isStuck && parent) || positionRoot || overflowRoot || document.body)}
          </>
        )
        : children
      }
    </div>
  )
};
