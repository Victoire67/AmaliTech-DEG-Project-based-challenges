import Option from "./Option";
import { type NodeCardProps } from "../../../types/Node/NodeTypes";
// components/NodeCard/NodeCard.tsx


function NodeCard({
  type,
  text,
  options = [],
  state = "default",
  onSelectOption,
  onClick,
}: NodeCardProps) {
  const isHavingOptions = type === "question"  && options.length  || type === "start"  && options.length 
  return (
    <div className={`bg-white grid gap-6 cursor-pointer  w-[288px] shadow-lg rounded-xl px-2 text-left py-4`} onClick={onClick}>
      {/* Label — "question" or "end" */}
      <span className="text-xs font-medium text-gray-400 tracking-wide">
        {type}
      </span>

      {/* Main text */}
      <p className="text-sm font-medium text-gray-800 leading-snug">
        {text}
      </p>

      {/* Answer options — only for question nodes */}
      {isHavingOptions && (
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