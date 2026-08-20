// components/Canvas/Connector.tsx

import { type ConnectorProps } from "../../../types/Node/NodeTypes";
// Node card dimensions — must match your NodeCard's actual rendered size
const NODE_WIDTH = 256; // w-64 = 16rem = 256px
const NODE_HEIGHT_ESTIMATE = 80; // approximate anchor point vertically

function Connector({ from, to }: ConnectorProps) {
  // Anchor from bottom-center of parent, to top-center of child
  const startX = from.x + NODE_WIDTH / 2;
  const startY = from.y + NODE_HEIGHT_ESTIMATE;
  const endX = to.x + NODE_WIDTH / 2;
  const endY = to.y;

  // Bezier curve control points for a smooth curve
  const midY = (startY + endY) / 2;
  const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

  return (
    <path
      d={path}
      stroke="#9CA3AF"
      strokeWidth={2}
      fill="none"
    />
  );
}

export default Connector;