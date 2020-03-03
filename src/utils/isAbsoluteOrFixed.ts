export const isAbsoluteOrFixed = (el: HTMLElement) => {
  const position = getComputedStyle(el).position;
  return position === 'absolute' || position === 'fixed';
}
