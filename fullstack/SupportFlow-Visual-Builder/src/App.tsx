import { createBrowserRouter, RouterProvider } from "react-router";
import EditorPage from "./pages/Editor";
import PreviewPage from "./pages/Preview";
import NotFound from "./components/ui/NotFound";
import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <EditorPage />
  },
  {
    path: "/preview",
    element: <PreviewPage />
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