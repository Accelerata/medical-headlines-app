import { createBrowserRouter } from "react-router-dom";
import Homepage from "@/pages/homepage";
import Login from "@/pages/login";
import Layout from "@/pages/layout";
import Publish from "@/pages/publish";
import Person from "@/pages/person";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/person",
        element: <Person />,
      },
    ],
  },
  {
    path: "/publish",
    element: <Publish />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
