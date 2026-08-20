// pages/PreviewMode.tsx
import { useState } from "react";
import type { FlowData, FlowNode } from "../../types/Node/NodeTypes";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";

// A single entry in the chat log: either a bot message, or the user's picked answer
type ChatEntry =
    | { kind: "bot"; text: string }
    | { kind: "user"; text: string };

function PreviewMode({ flowData }: { flowData: FlowData }) {
    const nodesById = Object.fromEntries(flowData.nodes.map((n) => [n.id, n]));
    const startNode = flowData.nodes.find((n) => n.type === "start")!;

    const [currentNode, setCurrentNode] = useState<FlowNode>(startNode);
    const [history, setHistory] = useState<ChatEntry[]>([
        { kind: "bot", text: startNode.text },
    ]);

    const handleSelectOption = (label: string, nextId: string) => {
        const nextNode = nodesById[nextId];
        if (!nextNode) return;

        setHistory((prev) => [
            ...prev,
            { kind: "user", text: label },
            { kind: "bot", text: nextNode.text },
        ]);
        setCurrentNode(nextNode);
    };

    const handleRestart = () => {
        setCurrentNode(startNode);
        setHistory([{ kind: "bot", text: startNode.text }]);
    };

    const isEnd = currentNode.type === "end";

    return (
        <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex flex-col">
            {/* Header */}
            <Header />

            {/* Chat area */}
            <main className="flex-1 relative px-10 py-8 flex flex-col gap-3 overflow-y-auto">
                {/* Decorative dot grid corners */}
                <div
                    className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #D97706 1.5px, transparent 1.5px)",
                        backgroundSize: "12px 12px",
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-40 h-24 pointer-events-none border"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #D97706 1.5px, transparent 1.5px)",
                        backgroundSize: "12px 12px",
                    }}
                />

                {history.map((entry, i) =>
                    entry.kind === "bot" ? (
                        <div
                            key={i}
                            className="self-start max-w-md bg-gray-200 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-2 text-sm"
                        >
                            {entry.text}
                        </div>
                    ) : (
                        <div
                            key={i}
                            className="self-end max-w-md z-10 bg-[#FF9D42] text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm"
                        >
                            {entry.text}
                        </div>
                    )
                )}

                {/* Answer options for the current node */}
                {!isEnd && (
                    <div className="self-end flex flex-col gap-2 mt-1">
                        {currentNode.options?.map((opt) => (
                            <button
                                key={opt.label}
                                onClick={() => handleSelectOption(opt.label, opt.nextId)}
                                className="px-4 py-2 rounded-xl bg-[#FF9D42] z-10 text-white text-sm text-right hover:bg-orange-500 transition"
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Restart prompt once a leaf/end node is reached */}
                {isEnd && (
                    <div className="self-start mt-2 mx-auto">
                        <button
                            onClick={handleRestart}
                            className="px-4 py-2 rounded-xl bg-[#FF9D42] text-white text-sm hover:bg-orange-600 transition"
                        >
                            Restart Conversation
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default PreviewMode;