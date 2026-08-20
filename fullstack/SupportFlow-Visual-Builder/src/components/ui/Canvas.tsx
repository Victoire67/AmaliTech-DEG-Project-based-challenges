// components/Canvas/Canvas.tsx
import { useRef, useState, useLayoutEffect } from "react";
import NodeCard from "./Node";
import Connector from "./Connector";

// types/flow.ts
export type NodeType = "start" | "question" | "end";

export interface NodeOption {
  label: string;
  nextId: string;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface FlowNode {
  id: string;
  type: NodeType;
  text: string;
  position: NodePosition;
  options?: NodeOption[];
}

interface Dimensions {
  width: number;
  height: number;
}


// DraggableNode: wraps NodeCard with drag + size-measuring behavior ----
function DraggableNode({
  node,
  onPositionChange,
  onMeasure,
}: {
  node: FlowNode;
  onPositionChange: (id: string, x: number, y: number) => void;
  onMeasure: (id: string, width: number, height: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  // Re-measure real rendered size after every render (text edits can change height)
  useLayoutEffect(() => {
    if (nodeRef.current) {
      const { width, height } = nodeRef.current.getBoundingClientRect();
      onMeasure(node.id, width, height);
    }
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return; // don't drag when clicking an answer
    setDragging(true);
    offset.current = {
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    onPositionChange(node.id, e.clientX - offset.current.x, e.clientY - offset.current.y);
  };


  const handlePointerUp = () => setDragging(false);

  return (
    <div
      ref={nodeRef}
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{ left: node.position.x, top: node.position.y }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <NodeCard type={node.type} text={node.text} options={node.options} />
    </div>
  );
}

//Canvas: owns node positions/sizes, renders connectors + draggable nodes ----
function Canvas({ children }: { children: FlowNode[] }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<FlowNode[]>(children);
  const [dimensions, setDimensions] = useState<Record<string, Dimensions>>({});

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, position: { x, y } } : n)));
  };

  const reportDimensions = (id: string, width: number, height: number) => {
    setDimensions((prev) => {
      const existing = prev[id];
      if (existing && existing.width === width && existing.height === height) return prev;
      return { ...prev, [id]: { width, height } };
    });
  };

  // Derive parent -> child connections from each node's options
  const connections = nodes.flatMap((node) =>
    (node.options ?? [])
      .filter((opt) => opt.nextId)
      .map((opt) => {
        const child = nodes.find((n) => n.id === opt.nextId);
        if (!child) return null;
        return { from: node, to: child, key: `${node.id}-${opt.nextId}` };
      })
      .filter((c): c is { from: FlowNode; to: FlowNode; key: string } => c !== null)
  );

  return (
    <div
      ref={canvasRef}
      className="mx-auto overflow-hidden bg-canvas relative w-300 h-200"
      style={{
        backgroundImage: "radial-gradient(circle, #E0C9A6 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Connector layer — sits behind nodes, ignores pointer events so dragging isn't blocked */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {connections.map((conn) => (
          <Connector
            key={conn.key}
            from={conn.from.position}
            to={conn.to.position}
            fromSize={dimensions[conn.from.id]}
            toSize={dimensions[conn.to.id]}
          />
        ))}
      </svg>

      {/* Node layer */}
      {nodes.map((node) => (
        <DraggableNode
          key={node.id}
          node={node}
          onPositionChange={updateNodePosition}
          onMeasure={reportDimensions}
        />
      ))}
    </div>
  );
}

export default Canvas;