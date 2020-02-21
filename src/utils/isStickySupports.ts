import memoizeOne from 'memoize-one';

const prefix = ['', '-o-', '-webkit-', '-moz-', '-ms-'];

export const isStickySupports = memoizeOne((): boolean => {
  const el = document.createElement('div');
  for (let i = 0; i < prefix.length; i += 1) {
      el.style.position = `${prefix[i]}sticky`
  }
  return el.style.position.indexOf('sticky') !== -1 ? true : false;
});
