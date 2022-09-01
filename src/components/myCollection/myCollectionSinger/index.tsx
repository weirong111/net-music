import { Space } from "antd";
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reqArtistSublist } from "../../../request";
import "./index.less";
export default function MycollectionSinger() {
  const [artist, setArtist] = useState<any[]>([]);
  const nav = useNavigate();
  useEffect(() => {
    const getArtist = async () => {
      const res = await reqArtistSublist();
      console.log(res);
      setArtist(res.data);
    };
    getArtist();
  }, []);
  const toSingerDetail = useCallback(
    (id: string) => {
      nav("/singerDetail", { state: id });
    },
    [nav]
  );
  const mapArtist = () => {
    return artist.map((item, index) => {
      return (
        <div
          onClick={() => toSingerDetail(item.id as string)}
          key={item.id}
          className={classNames({
            zhuangji_item: true,
            item_odd: (index + 1) % 2 === 0,
          })}
        >
          <div className="album_item_left">
            <Space>
              <img className="img_album_item" src={item.picUrl} alt="" />
              <span>{item.name}</span>
            </Space>
          </div>
          <div className="album_item_center">
            <span>专辑数： {item.albumSize}</span>
          </div>
          <div className="album_item_right">MV: {item.mvSize}</div>
        </div>
      );
    });
  };
  return (
    <div className="myArtist">
      <Space>
        <span className="myArtist_title">收藏的歌手</span>{" "}
        <span className="myArtist_length">({artist.length})</span>{" "}
      </Space>
      <div>{mapArtist()}</div>
    </div>
  );
}
