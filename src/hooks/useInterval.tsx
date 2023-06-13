import { useState, useEffect, useRef, useCallback } from "react";

export const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>();
  const [id, setId] = useState<number | NodeJS.Timer>();

  const clear = useCallback(() => {
    if (id) clearInterval(id);
  }, [id]);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    if (delay !== null) {
      const _id = setInterval(tick, delay);

      setId(_id);

      return () => {
        clear();
      };
    }
  }, [delay]);

  return {
    clear,
  };
};
