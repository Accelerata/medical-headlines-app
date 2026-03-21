import { createBrowserRouter } from "react-router-dom";
import Homepage from "@/pages/homepage";
import Login from "@/pages/login";
import Layout from "@/pages/layout";
import Publish from "@/pages/publish";
import Person from "@/pages/person";
import Article from "@/components/article";
import EditorPerson from "@/pages/editorperson";
import Search from "@/pages/search";
import SearchTo from "@/pages/searchto";

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
  {
    path: "/article/:id?",
    element: <Article />,
  },
  {
    path: "/editorperson",
    element: <EditorPerson />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/searchto/:keyword?",
    element: <SearchTo />,
  },
]);

export default router;
