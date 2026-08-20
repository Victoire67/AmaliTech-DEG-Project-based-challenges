import Header from "../components/ui/Header";
import NodeCard from "../components/ui/Node";
function EditorPage() {
    return <>
        <Header />
        <NodeCard type="question" text="boro niaye ?" options={[{ id: "1", label: "What is your name" }, { id: "2", label: "I don't have one" }]} />
    </>
}

export default EditorPage;