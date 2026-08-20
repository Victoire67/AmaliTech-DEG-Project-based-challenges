// components/Canvas/EditNodeModal.tsx
import { useState, useEffect } from "react";
import type { FlowNode } from "./Canvas";

interface EditNodeModalProps {
  isOpen : boolean;
  node: FlowNode | null;
  onClose: () => void;
  onSave: (id: string, updatedText: string) => void;
}

function EditNodeModal({ node, onClose, onSave , isOpen }: EditNodeModalProps) {
  const [text, setText] = useState("");

  // Sync local input state whenever a new node is opened
  useEffect(() => {
    if (node) setText(node.text);
  }, [node]);

  if (!node) return null; // modal is closed when there's no node selected

  const handleSave = () => {
    onSave(node.id, text);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} // click on backdrop closes modal
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-96"
        onClick={(e) => e.stopPropagation()} // prevent backdrop click from firing when clicking inside
      >
        <h2 className="text-lg font-semibold mb-4">Edit Node</h2>

        <label className="block text-sm text-gray-500 mb-1">Question Text</label>
        <textarea
          className="w-full border border-gray-200 rounded-lg p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-node-selected"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#FF9D42] text-white hover:opacity-90"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditNodeModal;