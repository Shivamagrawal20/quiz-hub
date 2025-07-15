import { useEffect, useState } from "react";

export function useScrollOpacity(ref: React.RefObject<HTMLElement>) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Opacity is 1 when the center of the element is at the center of the viewport
      // Fades to 0 as it moves away
      const visible = Math.min(
        1,
        Math.max(0, 1 - Math.abs(rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2))
      );
      setOpacity(visible);
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return opacity;
} 