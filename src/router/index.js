import Homepage from "@/pages/homepage";
import Login from "@/pages/login";
import Layout from "@/pages/layout";
import Publish from "@/pages/publish";
import Person from "@/pages/person";
import Article from "@/components/article";
import EditorPerson from "@/pages/editorperson";
import Search from "@/pages/search";
import SearchTo from "@/pages/searchto";
import Followed from "@/pages/followed";
import PersonTo from "@/pages/personto";
import { LOCAL_getToken } from "@/utils/localstorage";
import { createBrowserRouter, useLocation, Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const token = LOCAL_getToken();
  const location = useLocation();
  if (!token) {
    const redirect = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "person/:id?",
        element: (
          <RequireAuth>
            <Person />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/publish",
    element: (
      <RequireAuth>
        <Publish />
      </RequireAuth>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/article/:id?",
    element: (
      <RequireAuth>
        <Article />
      </RequireAuth>
    ),
  },
  {
    path: "/editorperson",
    element: (
      <RequireAuth>
        <EditorPerson />
      </RequireAuth>
    ),
  },
  {
    path: "/search",
    element: (
      <RequireAuth>
        <Search />
      </RequireAuth>
    ),
  },
  {
    path: "/searchto/:keyword?",
    element: (
      <RequireAuth>
        <SearchTo />
      </RequireAuth>
    ),
  },
  {
    path: "/followed",
    element: (
      <RequireAuth>
        <Followed />
      </RequireAuth>
    ),
  },
  {
    path: "/personto/:userId?",
    element: (
      <RequireAuth>
        <PersonTo />
      </RequireAuth>
    ),
  },
]);

export default router;
