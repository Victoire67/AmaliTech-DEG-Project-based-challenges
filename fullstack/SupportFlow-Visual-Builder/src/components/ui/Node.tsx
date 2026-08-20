import Option from "./Option";

// components/NodeCard/NodeCard.tsx
export type NodeType = "start" | "question" | "end" ;

export interface NodeOption {
  id: string;
  label: string;
}

export interface NodeCardProps {
  type: NodeType;
  text: string;
  options?: NodeOption[];
  state?: "default" | "selected" | "error";
  onSelectOption?: (optionId: string) => void;
  onClick?: () => void;
}

function NodeCard({
  type,
  text,
  options = [],
  state = "default",
  onSelectOption,
  onClick,
}: NodeCardProps) {
  return (
    <div className={`bg-white grid gap-6  w-[288px] shadow-lg rounded-xl px-2 text-left py-4`} onClick={onClick}>
      {/* Label — "question" or "end" */}
      <span className="text-xs font-medium text-gray-400 tracking-wide">
        {type}
      </span>

      {/* Main text */}
      <p className="text-sm font-medium text-gray-800 leading-snug">
        {text}
      </p>

      {/* Answer options — only for question nodes */}
      {type === "question" && options.length > 0 && (
        <div className="flex flex-col gap-2 mt-1 text-left">
          {options.map((opt) => (
          <Option question={opt.label} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NodeCard;