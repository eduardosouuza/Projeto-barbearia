import { useState, useEffect, useRef, MutableRefObject } from "react";

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function useLazyLoad<T extends HTMLElement>(
  options: UseLazyLoadOptions = {}
): [boolean, MutableRefObject<T | null>] {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T | null>(null);
  const { rootMargin = "0px", threshold = 0.1, triggerOnce = true } = options;

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement || (isVisible && triggerOnce)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && observer && currentElement) {
            observer.unobserve(currentElement);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [rootMargin, threshold, triggerOnce, isVisible]);

  return [isVisible, elementRef];
}
