import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppOutline, AddCircleOutline, UserOutline } from "antd-mobile-icons";
import { TabBar } from "antd-mobile";
import { LOCAL_getUserInfo } from "@/utils/localstorage";
import "./layout.css";

function getPersonPathFromStorage() {
  const raw = LOCAL_getUserInfo();
  if (!raw) return "/person";
  try {
    const u = JSON.parse(raw);
    const id = u?.id;
    if (id != null && String(id) !== "") {
      return `/person/${id}`;
    }
  } catch {
    // ignore
  }
  return "/person";
}

function tabKeyFromPathname(pathname) {
  if (pathname.startsWith("/person")) return "profile";
  if (pathname.startsWith("/publish")) return "/publish";
  return "/";
}

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const personPath = getPersonPathFromStorage();
  const activeKey = tabKeyFromPathname(pathname);

  const switchRoute = (key) => {
    if (key === "profile") {
      navigate(personPath);
      return;
    }
    navigate(key);
  };

  return (
    <div className="layout-root">
      <div className="layout-content">
        <Outlet />
      </div>
      <TabBar activeKey={activeKey} onChange={switchRoute}>
        <TabBar.Item key="/" icon={<AppOutline />} title="首页" />
        <TabBar.Item key="/publish" icon={<AddCircleOutline />} title="发布" />
        <TabBar.Item key="profile" icon={<UserOutline />} title="我的" />
      </TabBar>
    </div>
  );
};

export default Layout;
