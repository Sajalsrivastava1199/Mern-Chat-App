import { ChakraProvider } from "@chakra-ui/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet
} from "react-router-dom"

import "./App.css"
import "./index.css"

import ChatProvider from "./Context/ChatProvider.jsx"
import Homepage from "./Pages/Homepage.jsx"
import Chatpage from "./Pages/Chatpage.jsx"

// Layout that wraps all pages with ChatProvider
function AppLayout() {
  return (
    <ChatProvider>
      <Outlet /> {/* Child routes will render here */}
    </ChatProvider>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<Homepage />} />
      <Route path="/chats" element={<Chatpage />} />
    </Route>
  )
)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
)
