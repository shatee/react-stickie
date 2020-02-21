import { RefObject, useRef, useEffect, useCallback, useState } from 'react';

export const useIntersectionObserver = (ref: RefObject<HTMLElement>, options: IntersectionObserverInit) => {
  const intersectionObserverRef = useRef<IntersectionObserver>();
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const onObserve = useCallback((entries: IntersectionObserverEntry[]) => {
    setEntry(entries[0]);
  }, []);

  useEffect(() => {
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
      intersectionObserverRef.current = undefined;
    }

    if (ref.current) {
      intersectionObserverRef.current = new IntersectionObserver(onObserve, options);
      intersectionObserverRef.current.observe(ref.current);
    }

    return () => intersectionObserverRef.current?.disconnect();
  }, [ref.current, options.root, options.rootMargin, options.threshold]);

  return entry;
};
