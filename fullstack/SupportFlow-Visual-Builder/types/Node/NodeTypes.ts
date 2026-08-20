// types/flow.ts
export type NodeType = string;

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
    isOpen?: boolean
}

interface FlowMeta {
    theme: string;
    canvas_size: {
        w: number;
        h: number;
    };

}

export interface FlowData {
  meta: FlowMeta;
  nodes: FlowNode[];
}

export interface Dimensions {
    width: number;
    height: number;
}



export interface NodeOption {
    id: string;
    label: string;
}

export interface NodeCardProps {
    type: NodeType;
    text: string;
    options?: NodeOption[] | undefined;
    state?: "default" | "selected" | "error";
    onSelectOption?: (optionId: string) => void;
    onClick?: () => void;
}

export interface ConnectorProps {
    from: { x: number; y: number };
    to: { x: number; y: number };
    fromSize?: Dimensions;
    toSize?: Dimensions;
}

export interface EditNodeModalProps {
    isOpen: boolean;
    node: FlowNode | null;
    onClose: () => void;
    onSave: (id: string, updatedText: string) => void;
}
