import { useEffect, useRef, useCallback } from 'react';

export const useUiEvent = (target: HTMLElement | Window | null, type: keyof (WindowEventMap | HTMLElementEventMap), listener: EventListener): void => {
  const prevPropsRef = useRef<{ target: HTMLElement | Window | null; type: keyof (WindowEventMap | HTMLElementEventMap); listener: EventListener } | null>(null);

  const unlisten = useCallback((target: HTMLElement | Window | null, type: keyof (WindowEventMap | HTMLElementEventMap), listener: EventListener) => {
    if (!target) return;
    target.removeEventListener(type, listener);
  }, []);

  useEffect(() => {
    if (prevPropsRef.current) {
      unlisten(prevPropsRef.current.target, prevPropsRef.current.type, prevPropsRef.current.listener);
    }
    target && target.addEventListener(type, listener);
    prevPropsRef.current = { target, type, listener };
    return (): void => unlisten(target, type, listener);
  }, [target, type, listener]);
};
