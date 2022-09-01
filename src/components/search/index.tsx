import type { MenuProps } from "antd";
import { Menu } from "antd";
import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./index.less";

const items: MenuProps["items"] = [
  {
    label: "单曲",
    key: "/search",
  },
  {
    label: "歌手",
    key: "/search/singer",
  },
  {
    label: "专辑",
    key: "/search/zhuangji",
  },
  {
    label: "视频",
    key: "/search/video",
  },
];
const MySearch = () => {
  const location = useLocation();
  const nav = useNavigate();
  const onClick: MenuProps["onClick"] = (e) => {
    nav(e.key);
  };
  return (
    <div className="search">
      <Menu
        onClick={onClick}
        selectedKeys={[location.pathname]}
        mode="horizontal"
        items={items}
      />
      <Outlet />
    </div>
  );
};

export default MySearch;
