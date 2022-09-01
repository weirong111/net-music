import type { MenuProps } from "antd";
import { Menu } from "antd";
import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import "./index.less";
import { useNavigate, useLocation } from "react-router-dom";
import { reqGetUserAccount, reqGetUserPlaylist } from "../../request";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const Menus: React.FC = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [isShow, setShow] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const onClick: MenuProps["onClick"] = (e) => {
    console.log(e);
    nav(e.key);
  };

  const [items, setItems] = useState<MenuItem[]>([
    getItem("发现音乐", "/"),
    getItem("视频", "/videoMenu"),

    getItem("我的音乐", "/myMusic", null, [
      getItem("本地与下载", "/mymusic/local"),
      getItem("最近播放", "/mymusic"),
      getItem("我的收藏", "/mymusic/collection"),
    ]),
  ]);
  useEffect(() => {
    const getUserId = async () => {
      if (localStorage.getItem("uid")) {
        const id = JSON.parse(localStorage.getItem("uid") as string);
        const res2 = await reqGetUserPlaylist(id);
        const arr = (res2.playlist as any[]).filter(
          (item) => item.userId === id
        );
        const arr2 = (res2.playlist as any[]).filter(
          (item) => item.userId !== id
        );
        const group = arr.map((item) => getItem(item.name, item.id, null));
        const group2 = arr2.map((item) => getItem(item.name, item.id, null));
        setItems((items) => [
          ...items,
          getItem("我创建的菜单", "chuangjian", null, group),
          getItem("我收藏的歌单", "shoucang", null, group2),
        ]);
      } else {
        const res = await reqGetUserAccount();
        localStorage.setItem("uid", res.account.id);
        localStorage.setItem("nickname", res.profile.nickname);
        const res2 = await reqGetUserPlaylist(res.account.id);
        const arr = (res2.playlist as any[]).filter(
          (item) => item.userId === res.account.id
        );
        const arr2 = (res2.playlist as any[]).filter(
          (item) => item.userId !== res.account.id
        );
        const group = arr.map((item) => getItem(item.name, item.id, null));
        const group2 = arr2.map((item) => getItem(item.name, item.id, null));
        setItems((items) => [
          ...items,
          getItem("我创建的歌单", "chuangjian", null, group),
          getItem("我收藏的歌单", "shoucang", null, group2),
        ]);
      }
    };

    getUserId();
  }, []);

  return (
    <div
      className={classnames({
        menu1: isShow,
        menu2: !isShow,
      })}
      ref={divRef}
    >
      <Menu
        selectedKeys={[location.pathname]}
        onClick={onClick}
        style={{ width: 256 }}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default Menus;
