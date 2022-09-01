import { CaretRightOutlined } from "@ant-design/icons";
import React, { FC, memo, useRef } from "react";
import "./index.less";
import { useNavigate } from "react-router-dom";
import { reqGetMenuAll } from "../../../../request/index";
import LazyLoad from "react-lazyload";
type props = {
  recommend: { [key: string]: string }[];
};
const RecommendSong: FC<props> = ({ recommend }) => {
  const nav = useNavigate();
  const queryRef = useRef<HTMLDivElement | null>(null);
  const mapSongMenu = () => {
    const getAllSongs = async (id: string) => {
      nav("/songList", { state: { id } });
    };
    return recommend.map((item) => {
      const { id, picUrl, name, playCount } = item;
      return (
        <div className="recommend_item" key={id}>
          <div onClick={() => getAllSongs(id)} className="recommend_wrap_img">
            <img src={picUrl} alt="" />

            <div className="recommend_item_count">
              <CaretRightOutlined />
              <span>
                {parseInt(playCount) < 10000
                  ? playCount
                  : Math.floor(parseInt(playCount) / 10000) + "万"}
              </span>
            </div>
          </div>
          <div className="recommend_name">{name}</div>
        </div>
      );
    });
  };

  return <div className="RecommendSong">{mapSongMenu()}</div>;
};

export default memo(RecommendSong);
