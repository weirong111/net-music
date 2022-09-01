import React, { FC, useCallback } from "react";
import "./index.less";
import albumIng from "../../../assets/a82.png";
import { Button, message, Space, Tag } from "antd";
import {
  CaretRightOutlined,
  DownloadOutlined,
  PlusSquareOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { reqAlbumSub } from "../../../request";
type Iprops = {
  album: { [key: string]: any };
};

const AlbumHeader: FC<Iprops> = ({ album }) => {
  const nav = useNavigate();
  const { picUrl, name, artists, publishTime, id } = album;
  const mapArtists = useCallback(() => {
    return (artists as any[]).map((item) => {
      return (
        <span key={item.id} onClick={() => nav("/search", { state: item.id })}>
          {item.name}
        </span>
      );
    });
  }, [artists, nav]);
  const collect = async () => {
    const res = await reqAlbumSub(id);
    console.log(res);
    message.success("成功收藏该专辑");
  };
  return (
    <div className="albumHeader">
      <div className="albumHeader_left">
        <img className="album_blur" src={albumIng} alt="" />
        <img className="ablum_img" src={picUrl} alt="" />
      </div>
      <div className="albumHeader_right">
        <Space>
          <Tag color="#f50">专辑</Tag>
          <span className="albumHeader_right_name">{name}</span>
        </Space>

        <div style={{ marginTop: 10 }}>
          <Space>
            <Button
              onClick={() => message.info("暂未实现，敬请期待")}
              type="primary"
              shape="round"
              icon={<CaretRightOutlined />}
            >
              播放全部
            </Button>
            <Button
              onClick={collect}
              shape="round"
              icon={<PlusSquareOutlined />}
            >
              收藏
            </Button>
            <Button shape="round" icon={<DownloadOutlined />}>
              下载
            </Button>
            <Button shape="round" icon={<ShareAltOutlined />}>
              {album.info.shareCount}
            </Button>
          </Space>
        </div>
        <div className="albumHeader_right_artist">
          歌手：
          <Space className="albumHeader_right_artist_item">
            {mapArtists()}
          </Space>
        </div>
        <div className="albumHeader_right_time">
          时间: {dayjs(publishTime).format("YYYY-MM-DD")}
        </div>
      </div>
    </div>
  );
};

export default AlbumHeader;
