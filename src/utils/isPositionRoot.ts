export const isPositionRoot = (el: HTMLElement) => {
  return getComputedStyle(el).position !== 'static';
}
