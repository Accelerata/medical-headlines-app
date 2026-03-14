import { Outlet } from "react-router-dom";
import { AppOutline, AddCircleOutline, UserOutline } from "antd-mobile-icons";
import { TabBar } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import "./layout.css";

const tabs = [
  {
    key: "/",
    title: "首页",
    icon: <AppOutline />,
    path: "/",
  },
  {
    key: "publish",
    title: "发布",
    icon: <AddCircleOutline />,
    path: "/publish",
  },
  {
    key: "person",
    title: "我的",
    icon: <UserOutline />,
    path: "/persona",
  },
];

const Layout = () => {
  const navigate = useNavigate();

  const switchRoute = (path) => {
    navigate(path);
  };

  return (
    <div className="layout-root">
      <div className="layout-content">
        <Outlet />
      </div>
      <TabBar onChange={(path) => switchRoute(path)}>
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  );
};

export default Layout;
