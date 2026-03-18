import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppOutline, AddCircleOutline, UserOutline } from "antd-mobile-icons";
import { TabBar } from "antd-mobile";
import "./layout.css";

const tabs = [
  {
    key: "/",
    title: "首页",
    icon: <AppOutline />,
    path: "/",
  },
  {
    key: "/publish",
    title: "发布",
    icon: <AddCircleOutline />,
    path: "/publish",
  },
  {
    key: "/person",
    title: "我的",
    icon: <UserOutline />,
    path: "/person",
  },
];

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const switchRoute = (path) => {
    navigate(path);
  };

  return (
    <div className="layout-root">
      <div className="layout-content">
        <Outlet />
      </div>
      <TabBar activeKey={pathname} onChange={switchRoute}>
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  );
};

export default Layout;
