const isScrollableOverflow = (overflow: string): boolean => {
  return overflow === 'scroll' || overflow === 'auto';
};

export const isOverflowRoot = (el: HTMLElement): boolean => {
  const style = getComputedStyle(el);
  return (
    isScrollableOverflow(style.overflow)
    || isScrollableOverflow(style.overflowX)
    || isScrollableOverflow(style.overflowY)
  );
}
