import { LOCAL_getToken } from "@/utils/localstorage";
import { createBrowserRouter, useLocation, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const Homepage = lazy(() => import("@/pages/homepage"));
const Person = lazy(() => import("@/pages/person"));
const Publish = lazy(() => import("@/pages/publish"));
const Article = lazy(() => import("@/components/article"));
const EditorPerson = lazy(() => import("@/pages/editorperson"));
const Search = lazy(() => import("@/pages/search"));
const SearchTo = lazy(() => import("@/pages/searchto"));
const Followed = lazy(() => import("@/pages/followed"));
const PersonTo = lazy(() => import("@/pages/personto"));
const Login = lazy(() => import("@/pages/login"));
const Layout = lazy(() => import("@/pages/layout"));

const RouteFallback = () => (
  <div style={{ padding: 24, textAlign: "center" }}>页面加载中...</div>
);

const withSuspense = (element) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

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
        {withSuspense(<Layout />)}
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: withSuspense(<Homepage />),
      },
      {
        path: "person/:id?",
        element: (
          <RequireAuth>
            {withSuspense(<Person />)}
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/publish",
    element: (
      <RequireAuth>
        {withSuspense(<Publish />)}
      </RequireAuth>
    ),
  },
  {
    path: "/login",
    element: withSuspense(<Login />),
  },
  {
    path: "/article/:id?",
    element: (
      <RequireAuth>
        {withSuspense(<Article />)}
      </RequireAuth>
    ),
  },
  {
    path: "/editorperson",
    element: (
      <RequireAuth>
        {withSuspense(<EditorPerson />)}
      </RequireAuth>
    ),
  },
  {
    path: "/search",
    element: (
      <RequireAuth>
        {withSuspense(<Search />)}
      </RequireAuth>
    ),
  },
  {
    path: "/searchto/:keyword?",
    element: (
      <RequireAuth>
        {withSuspense(<SearchTo />)}
      </RequireAuth>
    ),
  },
  {
    path: "/followed",
    element: (
      <RequireAuth>
        {withSuspense(<Followed />)}
      </RequireAuth>
    ),
  },
  {
    path: "/personto/:userId?",
    element: (
      <RequireAuth>
        {withSuspense(<PersonTo />)}
      </RequireAuth>
    ),
  },
]);

export default router;
