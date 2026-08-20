import { createBrowserRouter, RouterProvider } from "react-router";
import EditorPage from "./pages/Editor";
import PreviewPage from "./pages/Preview";
import NotFound from "./components/ui/NotFound";
import "./index.css"
import flowData from "../flow_data.json"
const router = createBrowserRouter([
  {
    path: "/",
    element: <EditorPage />
  },
  {
    path: "/preview",
    element: <PreviewPage flowData={flowData} />
  },
  {
    path: "*",
    element: <NotFound />
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App;