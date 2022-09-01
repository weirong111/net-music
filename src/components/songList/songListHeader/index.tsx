import React, { FC, useState, useEffect, memo, useContext } from "react";
import { reqGetMenuHeader } from "../../../request/index";
import { Button, Space, Spin, Tag } from "antd";
import dayjs from "dayjs";
import "./index.less";
import {
  CaretRightOutlined,
  DownloadOutlined,
  PlusSquareOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import Context from "../../../redux/store";
type Iprops = {
  id: string;
};
const col: {
  [key: string]: string;
} = {
  0: "magenta",
  1: "red",
  2: "volcano",
  3: "orange",
  4: "gold",
  5: "lime",
  6: "green",
  7: "cyan",
  8: "blue",
  9: "geekblue",
  10: "purple",
};
const SongListHeader: FC<Iprops> = ({ id }) => {
  const songList = useContext(Context).state.songList;
  const [info, setInfo] = useState<{ [key: string]: any }>({});
  useEffect(() => {
    const getMenuDetail = async () => {
      const res = await reqGetMenuHeader(id);
      setInfo(res.playlist);
    };
    getMenuDetail();
  }, [id]);
  return info.length === 0 ? (
    <Spin tip="Loading..." size="large" />
  ) : (
    <div className="songListHeader">
      <div className="songListHeader_content">
        <img
          className="songListHeader_content_img"
          src={info.coverImgUrl}
          alt=""
        />
        <div className="songListHeader_content_title">
          <h2>{info.name}</h2>
          {info.creator ? (
            <Space>
              <img src={info.creator.avatarUrl} alt=""></img>
              <span className="songListHeader_content_nickname">
                {info.creator.nickname}
              </span>
              <span>{dayjs(info.createTime).format("YYYY-MM-DD")}</span>
            </Space>
          ) : (
            ""
          )}
          <div className="songListHeader_content_action">
            <Space>
              <Button
                type="primary"
                shape="round"
                icon={<CaretRightOutlined style={{ color: "white" }} />}
              >
                播放全部
              </Button>
              <Button
                type="default"
                shape="round"
                icon={<PlusSquareOutlined style={{ color: "#888" }} />}
              >
                收藏
              </Button>
              <Button
                type="default"
                shape="round"
                icon={<ShareAltOutlined style={{ color: "#888" }} />}
              >
                分享
              </Button>
              <Button
                type="default"
                shape="round"
                icon={<DownloadOutlined style={{ color: "#888" }} />}
              >
                下载全部
              </Button>
            </Space>
          </div>
          <div className="songListHeader_content_tag">
            <Space>
              <span>标签</span>
              {info.tags
                ? (info.tags as string[]).map((item, index) => (
                    <Tag
                      key={index}
                      color={col[Math.floor(Math.random() * 11)]}
                    >
                      {item}
                    </Tag>
                  ))
                : ""}
            </Space>
          </div>
          <div className="songListHeader_content">
            <Space>
              {info.tracks ? <span>歌曲： {songList.length}</span> : ""}
              {info.playCount ? <span>播放： {info.playCount}次</span> : ""}
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SongListHeader);
