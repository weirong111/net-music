import React, { useEffect, useState } from "react";
import "./index.less";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
const items: MenuProps["items"] = [
  {
    label: "视频",
    key: "/videoMenu",
  },
  {
    label: "MV",
    key: "/videoMenu/MV",
  },
];
export default function VideoMenu() {
  const location = useLocation();
  const nav = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key !== location.pathname) {
      nav(e.key);
    }
  };
  useEffect(() => {
    console.log(location);
  }, [location]);
  return (
    <div id="videoMenu">
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
