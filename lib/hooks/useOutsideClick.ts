import { useEffect, useRef } from "react";

export default function useOutsideClick<T extends HTMLElement>(
  callback: () => void,
  exceptions?: string[]
): React.RefObject<T> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (
          exceptions?.some((selector) =>
            (event.target as Element).closest(selector)
          )
        ) {
          return;
        }
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref]);

  return ref;
}
