import { useCallback, useRef } from "react";

export function useScrollSet<T extends HTMLElement>() {
  const isScrollSet = useRef(false);
  const targetRef = useRef<T>(null);

  const setScrollToBottom = useCallback(() => {
    if (targetRef.current && !isScrollSet.current) {
      targetRef.current.scrollTop = targetRef.current.scrollHeight;
      isScrollSet.current = true;
    }
  }, []);

  return { targetRef, setScrollToBottom };
}
