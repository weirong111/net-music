import React, { useCallback, useEffect, useState } from "react";
import { reqGetCollectAlbums } from "../../../request";
import img from "../../../assets/a6l.png";
import { Space } from "antd";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import "./index.less";
export default function MyAlbum() {
  const nav = useNavigate();
  const [album, setAlbum] = useState<any[]>([]);
  useEffect(() => {
    const getAlbum = async () => {
      const res = await reqGetCollectAlbums();
      console.log(res);
      setAlbum(res.data as any[]);
    };
    getAlbum();
  }, []);

  const ToAlbumList = useCallback(
    (id: string) => {
      sessionStorage.setItem("album", id);
      nav("/albumList", { state: id });
    },
    [nav]
  );
  const mapAlbum = useCallback(() => {
    return album.map((item, index) => {
      const help = new Array<string>();
      for (const sb of item.artists) {
        help.push(sb.name);
      }

      return (
        <div
          onClick={() => ToAlbumList(item.id)}
          className={classNames({
            zhuangji_item: true,
            item_odd: (index + 1) % 2 === 0,
          })}
        >
          <div key={item.id} className="album_item_left">
            <Space>
              <div className="album_img_set">
                <img className="img_blur" src={img} alt="" />
                <img className="img_album_item" src={item.picUrl} alt="" />
              </div>

              <span>{item.name}</span>
            </Space>
          </div>
          <div className="album_item_right">{help.join(" / ")}</div>
        </div>
      );
    });
  }, [ToAlbumList, album]);

  return (
    <div className="myAlbum">
      <Space>
        <span className="myAlbum_title">收藏的专辑 </span>
        <span className="myAlbum_length">({album.length})</span>
      </Space>
      <div>{mapAlbum()}</div>
    </div>
  );
}
