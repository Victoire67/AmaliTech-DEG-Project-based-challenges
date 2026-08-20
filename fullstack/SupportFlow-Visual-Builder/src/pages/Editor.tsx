import Header from "../components/ui/Header";
import Canvas from "../components/ui/Canvas";
import data from "../../flow_data.json"
import Footer from "../components/ui/Footer";

function EditorPage() {
    const nodes = data.nodes;
    return <>
        <Header />
        <Canvas children = {nodes} />
        <Footer />
    </>
}

export default EditorPage;