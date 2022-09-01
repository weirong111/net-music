import { Space } from "antd";
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SingerDetail from "../../pages/singerDetail";
import { reqSearchResult } from "../../request";
import "./index.less";
export default function SearchSinger() {
  const [singers, setSingers] = useState<any[]>([]);
  const nav = useNavigate();
  useEffect(() => {
    const getSearch = async () => {
      const res = await reqSearchResult(
        sessionStorage.getItem("search") as string,
        100,
        2,
        0
      );
      setSingers(res.result.artists);
    };
    getSearch();
  }, []);
  //   "id": 36192166,
  //                 "name": "许嵩家的聆听者",
  //                 "picUrl": "https://p1.music.126.net/CmeU9kH0sePG54Qc-KF9mQ==/109951165198235029.jpg",
  //                 "alias": [],
  //                 "albumSize": 0,
  //                 "picId": 109951165198235020,
  //                 "img1v1Url": "https://p1.music.126.net/KyHhiwbZKlpoaoQJZ7PD2A==/109951166641206328.jpg",
  //                 "accountId": 255493307,
  //                 "img1v1": 109951166641206340,
  //                 "mvSize": 0,
  //                 "followed": false,
  //                 "trans": null
  const toSingerDetail = (id: string) => {
    nav("/singerDetail", { state: id });
    sessionStorage.setItem("singerDetail", id);
  };
  const mapSingers = useCallback(() => {
    return singers.map((item: any, index: number) => {
      const { picUrl, name, id } = item;
      return (
        <div
          onClick={() => toSingerDetail(id)}
          key={id}
          className={classNames({
            songItem: true,
            item_odd: (index + 1) % 2 === 1,
            item_even: (index + 1) % 2 === 0,
          })}
        >
          <Space>
            <img src={picUrl} alt="" />
            <span>{name}</span>
          </Space>
        </div>
      );
    });
  }, [singers, toSingerDetail]);
  return <div className="searchSinger">{mapSingers()}</div>;
}
