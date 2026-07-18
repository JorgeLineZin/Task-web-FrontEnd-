import { createBrowserRouter } from "react-router-dom"

import { MainLayout } from "@/layouts/MainLayout"
import { Tasks } from "@/pages/Tasks"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Tasks,
      },
    ],
  },
])
