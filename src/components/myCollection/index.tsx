import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./index.less";
export default function MyCollection() {
  const nav = useNavigate();
  const location = useLocation();
  useEffect(() => {
    console.log(location);
  }, [location]);
  const items: MenuProps["items"] = [
    {
      label: "专辑",
      key: "/mymusic/collection",
    },
    {
      label: "歌手",
      key: "/mymusic/collection/singer",
    },
    {
      label: "视频",
      key: "/mymusic/collection/video",
    },
  ];
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    nav(e.key);
  };
  return (
    <div className="myCollection">
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
