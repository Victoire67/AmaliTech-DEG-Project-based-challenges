// components/Canvas/Canvas.tsx
import { useRef, useState, useLayoutEffect } from "react";
import NodeCard from "./Node";
import Connector from "./Connector";
import EditNodeModal from "./EditModal";
import  {type FlowNode , type Dimensions} from "../../../types/Node/NodeTypes"


// DraggableNode: wraps NodeCard with drag + size-measuring behavior ----
function DraggableNode({
  node,
  onPositionChange,
  onMeasure,
  onNodeClick,
  dimmed,
}: {
  node: FlowNode;
  onPositionChange: (id: string, x: number, y: number) => void;
  onMeasure: (id: string, width: number, height: number) => void;
  onNodeClick: (id: string) => void;
  dimmed: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
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
    hasMoved.current = false;
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    offset.current = {
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;

    // Mark as a real drag once the pointer has moved a few pixels
    const dx = Math.abs(e.clientX - pointerDownPos.current.x);
    const dy = Math.abs(e.clientY - pointerDownPos.current.y);
    if (dx > 4 || dy > 4) hasMoved.current = true;

    onPositionChange(node.id, e.clientX - offset.current.x, e.clientY - offset.current.y);
  };

  const handlePointerUp = () => {
    setDragging(false);
    // Only treat it as a "click" (open modal) if the pointer barely moved
    if (!hasMoved.current) {
      onNodeClick(node.id);
    }
  };

  return (
    <div
      ref={nodeRef}
      className="absolute cursor-grab active:cursor-grabbing select-none transition-opacity duration-200"
      style={{ left: node.position.x, top: node.position.y, opacity: dimmed ? 0.5 : 1 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <NodeCard type={node.type} text={node.text} options={node.options} />
    </div>
  );
}

// Canvas: owns node positions/sizes, renders connectors + draggable nodes ----
function Canvas({ children }: { children: FlowNode[] }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<FlowNode[]>(children);
  const [dimensions, setDimensions] = useState<Record<string, Dimensions>>({});
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Open modal for the clicked node
  const handleNodeClick = (id: string) => {
    setEditingNodeId(id);
  };

  // Close modal without saving
  const handleModalClose = () => {
    setEditingNodeId(null);
  };

  // Persist edited text back into node state, then close
  const handleNodeSave = (id: string, updatedText: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, text: updatedText } : n)));
    setEditingNodeId(null);
  };

  const editingNode = nodes.find((n) => n.id === editingNodeId) ?? null;

  // A node is dimmed when there's an active search query and its text doesn't match
  const isNodeDimmed = (node: FlowNode) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return false;
    return !node.text.toLowerCase().includes(query);
  };

  return (
    <div
      ref={canvasRef}
      className="mx-auto overflow-hidden bg-canvas relative w-300 h-200"
      style={{
        backgroundImage: "radial-gradient(circle, #E0C9A6 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Search bar — floats above the canvas */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search nodes..."
          className="px-3 py-2 rounded-lg border border-gray-300 bg-white/90 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-node-selected w-56"
        />
      </div>

      {/* Connector layer — sits behind nodes, ignores pointer events so dragging isn't blocked */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {connections.map((conn) => {
          // A connector is only useful when both ends are relevant to the current
          // search — if either end is dimmed, hide the connector entirely rather
          // than just fading it.
          const connectorHidden = isNodeDimmed(conn.from) || isNodeDimmed(conn.to);
          if (connectorHidden) return null;

          return (
            <Connector
              key={conn.key}
              from={conn.from.position}
              to={conn.to.position}
              fromSize={dimensions[conn.from.id]}
              toSize={dimensions[conn.to.id]}
            />
          );
        })}
      </svg>

      {/* Node layer */}
      {nodes.map((node) => (
        <DraggableNode
          key={node.id}
          node={node}
          onPositionChange={updateNodePosition}
          onMeasure={reportDimensions}
          onNodeClick={handleNodeClick}
          dimmed={isNodeDimmed(node)}
        />
      ))}

      {/* Modal — controlled by editingNodeId, renders on top of everything */}
      <EditNodeModal isOpen={editingNode ? true : false} node={editingNode} onClose={handleModalClose} onSave={handleNodeSave} />
    </div>
  );
}

export default Canvas;