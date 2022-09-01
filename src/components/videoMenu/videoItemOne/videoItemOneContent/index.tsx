import React, { FC, useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { reqGetVideoAll, reqGetVideoGroup } from "../../../../request";
import { Spin } from "antd";
import dayjs from "dayjs";
import "./index.less";
import { CaretRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
type Iprops = {
  select: string;
};

const VideoItemOneContent: FC<Iprops> = ({ select }) => {
  const [data, setData] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [isMore, setIsMore] = useState(true);
  const nav = useNavigate();
  useEffect(() => {
    const getContent = async () => {
      setOffset(0);
      if (select === "全部视频") {
        const res = await reqGetVideoAll(0);
        const res2 = await reqGetVideoAll(1);
        console.log(res);
        console.log(res2);
        setData(res.datas);
        setOffset((offset) => offset++);
        setIsMore(res.hasmore);
      } else {
        const res = await reqGetVideoGroup(select, 0);
        setData(res.datas);
      }
    };
    getContent();
  }, [select]);
  const toMvDetail = useCallback(
    (id: string) => {
      nav("/videoDetail", { state: id });
    },
    [nav]
  );
  const mapData = useCallback(() => {
    return data.map((item) => {
      const {
        vid,
        coverUrl,
        duration,
        playTime,
        description,
        creator,
        title,
      } = item.data;

      return (
        <div
          onClick={() => toMvDetail(vid)}
          key={vid}
          className="VideoItemOneContent_item"
        >
          <div className="VideoItemOneContent_item_top">
            <img src={coverUrl} alt="" />
            <span className="VideoItemOneContent_item_top_creator">
              {dayjs(duration).format("mm:ss")}
            </span>
            <span className="VideoItemOneContent_item_top_playTime">
              <CaretRightOutlined />
              {playTime < 10000 ? 10000 : `${Math.floor(playTime / 10000)}万`}
            </span>
          </div>
          <div className="VideoItemOneContent_item_down">
            {title || description}
          </div>
          <div className="VideoItemOneContent_item_down_nickname">
            {creator && creator.nickname && <span>by {creator.nickname}</span>}
          </div>
        </div>
      );
    });
  }, [data, toMvDetail]);

  const fetchData = async () => {
    if (select === "全部视频") {
      const res = await reqGetVideoAll(offset);
      console.log(res);
      setData((data) => [...data, ...res.datas]);
      setOffset((offset) => offset++);
      setIsMore(res.hasmore);
    } else {
      const res = await reqGetVideoGroup(select, offset);
      setData((data) => [...data, ...res.datas]);
    }
  };
  return (
    <div className="VideoItemOneContent">
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

export default VideoItemOneContent;
