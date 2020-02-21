/**
 * position: absolute を適用した時に基点となる親 DOM かどうか
 */
export const isAbsoluteRoot = (el: HTMLElement): boolean => {
  return getComputedStyle(el).position !== 'static';
};
