export const closestBy = (fn: (target: HTMLElement) => boolean, target: HTMLElement): HTMLElement | null => {
  for (let el = target.parentElement; el?.parentElement; el = el.parentElement) {
    if (fn(el)) return el;
  }
  return null;
};
