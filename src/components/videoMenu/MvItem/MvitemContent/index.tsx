import React, { FC, useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { reqGetMvAll } from "../../../../request";
import { Spin } from "antd";
import "./index.less";
import { CaretRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type Iprops = {
  area: string;
  order: string;
  type: string;
};
const MvitemContent: FC<Iprops> = ({ area, order, type }) => {
  const [isMore, setMore] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const nav = useNavigate();
  const toMvDetail = (id: string) => {
    nav("/mvDetail", { state: id });
  };
  const mapData = useCallback(() => {
    return data.map((item) => {
      const mapArtists = () => {
        const res = [];
        for (let artist of item.artists) {
          res.push(artist.name);
        }
        return res.join("/");
      };
      const { id, cover, name, playCount } = item;
      return (
        <div
          onClick={() => toMvDetail(id)}
          key={id}
          className="MvitemContent_item"
        >
          <div className="MvitemContent_item_up">
            <img src={cover} alt={name} />

            <span className="MvitemContent_item_up_playCount">
              <CaretRightOutlined />
              {playCount > 10000
                ? `${Math.floor(playCount / 10000)}万`
                : playCount}
            </span>
          </div>
          <div className="MvitemContent_item_name">{name}</div>
          <div className="MvitemContent_item_artists">{mapArtists()}</div>
        </div>
      );
    });
  }, [data]);
  const fetchData = async () => {
    const res = await reqGetMvAll(area, type, order, 24, offset * 24);
    setOffset((offset) => offset++);
    setMore(res.hasMore);
    setData((data) => [...data, ...res.data]);
  };
  useEffect(() => {
    const GetMvAll = async () => {
      setOffset(0);
      const res = await reqGetMvAll(area, type, order, 24, 0);
      console.log(res.data);
      setData(res.data);
      setMore(res.hasMore);
    };
    GetMvAll();
  }, [area, order, type]);
  return (
    <div className="MvitemContent">
      <InfiniteScroll
        hasMore={isMore}
        loader={<Spin />}
        dataLength={data.length}
        next={fetchData}
        scrollableTarget="videoMenu"
      >
        <div className="VideoItemOneContent_grid">{mapData()}</div>
      </InfiniteScroll>
    </div>
  );
};

export default MvitemContent;
