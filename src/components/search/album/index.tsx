import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { reqGetSingerAlbum, reqSingerDetail } from "../../../request";
import alImg from "../../../assets/a6l.png";
import { Pagination, Space } from "antd";
import "./index.less";
import classNames from "classnames";
const Zhuangji = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [album, setAlbum] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const checkValid = useCallback(() => {
    const id = location.state || sessionStorage.getItem("singerDetail");
    if (id) return id;
    return null;
  }, [location.state]);
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
                <img className="img_blur" src={alImg} alt="" />
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

  const handleOnChange = async (page: number, pageSize: number) => {
    const id = checkValid();
    if (id) {
      const res = await reqGetSingerAlbum(id as string, 20, (page - 1) * 20);
      setAlbum(res.hotAlbums);
    }
  };

  useEffect(() => {
    const getAlbum = async () => {
      const id = checkValid();
      if (id) {
        const res = await reqGetSingerAlbum(id as string);
        const res2 = await reqSingerDetail(id as string);

        setAlbum(res.hotAlbums);
        setTotal(res2.data.artist.albumSize);
      }
    };
    getAlbum();
  }, [checkValid]);

  return (
    <div className="zhuangji">
      <div>{mapAlbum()}</div>
      <div>
        <div className="album_Pagination">
          <Pagination
            defaultCurrent={1}
            size="small"
            hideOnSinglePage={true}
            total={total}
            pageSize={20}
            onChange={handleOnChange}
            showQuickJumper={true}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Zhuangji;
