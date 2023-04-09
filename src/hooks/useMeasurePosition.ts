import { useEffect, useRef } from "react";
import { type Position } from "./usePositionReorder";

export const useMeasurePosition = (update: (pos: Position) => void) => {
  // We'll use a `ref` to access the DOM element that the `motion.div` produces.
  // This will allow us to measure its width and position, which will be useful to
  // decide when a dragging element should switch places with its siblings.
  const ref = useRef<HTMLDivElement>(null);

  // Update the measured position of the item so we can calculate when we should rearrange.
  useEffect(() => {
    update({
      height: (ref.current && ref.current.offsetHeight) ?? 0,
      width: (ref.current && ref.current.offsetWidth) ?? 0,
      left: (ref.current && ref.current.offsetLeft) ?? 0,
      top: (ref.current && ref.current.offsetTop) ?? 0,
    });
  });

  return ref;
};
