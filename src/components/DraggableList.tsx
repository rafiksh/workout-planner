import React from "react";
import { useState } from "react";
import { motion } from "framer-motion"; // 2.9.4
import {
  type Position,
  type ViewBox,
  usePositionReorder,
} from "../hooks/usePositionReorder";
import { useMeasurePosition } from "../hooks/useMeasurePosition";

export const DraggableList = () => {
  const [order, updatePosition, updateOrder] = usePositionReorder(items);

  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        flexWrap: "wrap",
        width: 700,
      }}
    >
      {order.length > 0 &&
        order.map((item, i) => (
          <Item
            key={item}
            item={item}
            i={i}
            updatePosition={updatePosition}
            updateOrder={updateOrder}
          />
        ))}
    </div>
  );
};

function Item({
  i,
  item,
  updatePosition,
  updateOrder,
}: {
  i: number;
  item: number;
  updatePosition: (i: number, offset: Position) => void;
  updateOrder: (i: number, viewportBox: ViewBox) => void;
}) {
  const [isDragging, setDragging] = useState(false);

  const ref = useMeasurePosition((pos: Position) => updatePosition(i, pos));

  return (
    <motion.div
      ref={ref}
      layout
      initial={false}
      style={{
        background: "white",
        width: 120,
        borderRadius: 5,
        zIndex: isDragging ? 3 : 1,
        height: 100,
        margin: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 24,
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 3px 3px rgba(0,0,0,0.15)",
      }}
      whileTap={{
        scale: 1.12,
        boxShadow: "0px 5px 5px rgba(0,0,0,0.1)",
      }}
      drag={true}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onViewportBoxUpdate={(viewportBox: ViewBox) => {
        isDragging && updateOrder(i, viewportBox);
      }}
    >
      {item}
    </motion.div>
  );
}

const items = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
];
