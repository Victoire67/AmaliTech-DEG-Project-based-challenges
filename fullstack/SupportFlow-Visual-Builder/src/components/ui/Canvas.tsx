// components/Canvas/Canvas.tsx
import { useRef } from "react";
import NodeCard from "./Node";
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


function Canvas({ children }: { children: FlowNode[] }) {
    const canvasRef = useRef<HTMLDivElement>(null);
    return (
        <div
            ref={canvasRef}
            className="mx-auto overflow-hidden bg-canvas relative w-300 h-200"
            style={{
                backgroundImage: "radial-gradient(circle, #E0C9A6 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px",
            }}
        >
            {
                children.map(node => {
                    return (<div className="absolute" style={{
                        left: node.position.x,
                        top: node.position.y,
                    }}>
                        <NodeCard key={node.text} type={node.type} text={node.text} options={node.options} />
                    </div>)
                })
            }
        </div>
    );
}

export default Canvas;