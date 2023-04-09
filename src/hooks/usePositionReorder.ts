import { useState, useRef } from "react";
import { clamp } from "popmotion";
import { arrayMoveImmutable } from "array-move";

export interface Position {
  height: number;
  width: number;
  left: number;
  top: number;
}

export interface ViewBox {
  x: {
    min: number;
    max: number;
    center: number;
  };
  y: {
    min: number;
    max: number;
    center: number;
  };
}

export const usePositionReorder = (
  initialState: number[]
): [
  number[],
  (i: number, offset: Position) => void,
  (i: number, viewportBox: ViewBox) => void
] => {
  const [order, setOrder] = useState<number[]>(initialState);

  // We need to collect an array of width and position data for all of this component's
  // `Item` children, so we can later us that in calculations to decide when a dragging
  // `Item` should swap places with its siblings.
  const positions = useRef<Position[]>([]).current;
  // const updatePosition = (i, offset) => (positions[i] = offset);
  const updatePosition = (i: number, offset: Position) =>
    (positions[i] = offset);

  // Find the ideal index for a dragging item based on its position in the array, and its
  // current drag offset. If it's different to its current index, we swap this item with that
  // sibling.
  const updateOrder = (i: number, viewportBox: ViewBox) => {
    const targetIndex = findIndex(i, viewportBox, positions);
    if (targetIndex !== i) {
      const newOrder = arrayMoveImmutable(order, i, targetIndex);

      setOrder(newOrder);
    }
  };

  return [order, updatePosition, updateOrder];
};

// This margin needs to match space between cells exactly.
// TODO: Optimize for safer handling
const margin = 20;

export const findIndex = (
  i: number,
  currentBox: ViewBox,
  positions: Position[]
) => {
  if (!positions[i]) {
    return i;
  }
  let target = i;

  const { left, width, top, height } = positions[i] as Position;

  const bottom = top + height;

  currentBox.x.center = (currentBox.x.min + currentBox.x.max) / 2;
  currentBox.y.center = (currentBox.y.min + currentBox.y.max) / 2;

  // If current within same row
  if (
    currentBox.y.center > top - margin &&
    currentBox.y.center < bottom + margin
  ) {
    // Moving right
    if (currentBox.x.center > left + width / 2) {
      const nextItem = positions[i + 1];
      if (nextItem === undefined || nextItem.top !== top) return i; // If end of array or not in same row
      if (currentBox.x.center > nextItem.left + nextItem.width / 2) {
        target = i + 1;
      }
      // Moving left
    } else if (currentBox.x.center < left + width / 2) {
      const prevItem = positions[i - 1];
      if (prevItem === undefined || prevItem.top !== top) return i; // If beginning of array or not in same row
      if (currentBox.x.center < prevItem.left + prevItem.width / 2) {
        target = i - 1;
      }
    }
    return target;
  }

  // If current going to row above
  if (currentBox.y.center < top - margin) {
    // Add index to positions array
    const indexedPositions = positions.map((el, i) => {
      return { ...el, i };
    });

    // Get box directly above
    const boxesAbove = indexedPositions.filter(
      (el) => el.left === left && el.top < top
    );
    const boxAbove = boxesAbove[boxesAbove.length - 1];
    if (boxAbove === undefined) return target;

    // Return box to right if slightly right of center, else return box above
    if (boxAbove.left + boxAbove.width / 2 < currentBox.x.center) {
      return boxAbove.i + 1;
    } else if (boxAbove.left + boxAbove.width / 2 >= currentBox.x.center) {
      return boxAbove.i;
    }

    return target;
  }

  // If current going to row below
  if (currentBox.y.center > bottom + margin) {
    // Add index to positions array
    const indexedPositions = positions.map((el, i) => {
      return { ...el, i };
    });

    // Get box directly above
    const boxesBelow = indexedPositions.filter(
      (el) => el.left === left && el.top > top
    );
    const boxBelow = boxesBelow[0];
    if (boxBelow === undefined) return target;

    // Return box to left if slightly left of center, else return box below
    if (boxBelow.left + boxBelow.width / 2 <= currentBox.x.center) {
      return boxBelow.i;
    } else if (boxBelow.left + boxBelow.width / 2 > currentBox.x.center) {
      return boxBelow.i - 1;
    }

    return target;
  }

  return clamp(0, positions.length, target);
};
