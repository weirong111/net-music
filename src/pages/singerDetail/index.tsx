import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./index.less";
import { reqGetSingerAlbum, reqSingerDetail } from "../../request/index";
import { Button, message, Space, Menu } from "antd";
import type { MenuProps } from "antd";
import { PlusSquareOutlined, UserOutlined } from "@ant-design/icons";
export default function SingerDetail() {
  const location = useLocation();
  const nav = useNavigate();

  const [info, setInfo] = useState<any>({
    artist: {
      id: "",
      name: "",
      musicSize: 0,
      albumSize: 0,
      mvSize: 0,
    },
  });
  const items: MenuProps["items"] = [
    {
      label: "专辑",
      key: "/singerDetail",
    },
    {
      label: "MV",
      key: "/singerDetail/MV",
    },
    {
      label: "歌手详情",
      key: "/singerDetail/detail",
    },
    {
      label: "相似歌手",
      key: "/singerDetail/simple",
    },
    {
      label: "演出",
      key: "/singerDetail/live",
    },
  ];
  useEffect(() => {
    const getSingSimp = async () => {
      const res = await reqSingerDetail(
        (location.state as string) ||
          (sessionStorage.getItem("singerDetail") as string)
      );

      setInfo(res.data);
    };
    getSingSimp();
  }, [location.state]);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    nav(e.key);
  };
  return (
    <div className="singerDetail">
      <div key={info.artist.id} className="singerDetail_header">
        <div className="singerDetail_header_left">
          <img src={info.artist.cover} alt=""></img>
        </div>
        <div className="singerDetail_header_right">
          <div className="singerDetail_header_right_name">
            {info.artist.name}
          </div>
          <div className="singerDetail_header_right_button">
            <Space>
              <Button
                onClick={() => message.info("暂未实现，敬请期待")}
                shape="round"
                icon={<PlusSquareOutlined />}
              >
                收藏
              </Button>
              <Button
                onClick={() => message.info("暂未实现，敬请期待")}
                shape="round"
                icon={<UserOutlined />}
              >
                个人主页
              </Button>
            </Space>
          </div>
          <div>
            <Space>
              <span>单曲数: {info.artist.musicSize}</span>
              <span> 专辑数: {info.artist.albumSize}</span>
              <span> mv数: {info.artist.mvSize}</span>
            </Space>
          </div>
        </div>
      </div>
      <div className="singerDetail_content">
        <Menu
          onClick={onClick}
          selectedKeys={[location.pathname]}
          mode="horizontal"
          items={items}
        />
        <Outlet />
      </div>
    </div>
  );
}
