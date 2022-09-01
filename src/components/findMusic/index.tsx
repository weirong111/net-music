import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./index.less";

const items: MenuProps["items"] = [
  {
    label: "个性推荐",
    key: "/",
  },

  {
    label: "歌单",
    key: "/songMenus",
  },
  {
    label: "排行榜",
    key: "/rankingList",
  },
  {
    label: "歌手",
    key: "/singer",
  },
  {
    label: "最新音乐",
    key: "/newMusic",
  },
];
export default function FindMusic() {
  const location = useLocation();
  const nav = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    nav(e.key);
  };

  return (
    <div className="findMusic">
      <Menu
        onClick={onClick}
        selectedKeys={[location.pathname]}
        mode="horizontal"
        items={items}
      />
      <Outlet />
    </div>
  );
}
