import React from 'react';
import { StickyNotSupports } from './StickyNotSupports';
import { StickySupports } from './StickySupports';
import { isStickySupports } from './utils/isStickySupports';
import { StickyProps } from './StickyProps';
import { isIntersectionObserverSupports } from './utils/isIntersectionObserverSupports';

export const Sticky = (props: StickyProps): React.ReactElement => {
  return !props.ignorePositionSticky && isStickySupports() && isIntersectionObserverSupports()
    ? <StickySupports {...props} />
    : <StickyNotSupports {...props} />;
};
