import { Divider, Tag, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { reqGetArtistlist } from "../../../../request";
import "./index.less";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
const { CheckableTag } = Tag;

const lang: [string, number][] = [
  ["全部", -1],
  ["华语", 7],
  ["欧美", 96],
  ["日本", 8],
  ["韩国", 16],
  ["其他", 0],
];
const se: [string, number][] = [
  ["全部", -1],
  ["男歌手", 1],
  ["女歌手", 2],
  ["乐队", 3],
];

export default function SingerHeader() {
  const [selectLan, setSelectLan] = useState(-1);
  const [selectType, setSelectType] = useState(-1);
  const [selectZimu, setSelectZimu] = useState("热门");
  const [singer, setSinger] = useState<any[]>([]);
  const [isMore, setIsMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const nav = useNavigate();
  const handleChangeLan = useCallback(
    async (tag: [string, number], check: boolean) => {
      if (selectLan === tag[1]) return;

      const initial =
        selectZimu === "热门"
          ? "-1"
          : selectZimu === "#"
          ? "0"
          : selectZimu.toLowerCase();
      const res = await reqGetArtistlist(20, 0, selectType, tag[1], initial);
      console.log(res);
      setSelectLan(tag[1]);
      setSinger(res.artists);
      setIsMore(res.more);
      setOffset(0);
    },
    [selectLan, selectType, selectZimu]
  );
  const maplang = useCallback(() => {
    return lang.map((item) => {
      return (
        <span key={item[1]}>
          <CheckableTag
            key={item[1]}
            checked={selectLan === item[1]}
            onChange={(check) => handleChangeLan(item, check)}
          >
            {item[0]}
          </CheckableTag>
          <Divider type="vertical" />
        </span>
      );
    });
  }, [handleChangeLan, selectLan]);
  const handleChangeType = useCallback(
    async (tag: [string, number], check: boolean) => {
      if (selectType === tag[1]) return;

      const initial =
        selectZimu === "热门"
          ? "-1"
          : selectZimu === "#"
          ? "0"
          : selectZimu.toLowerCase();
      const res = await reqGetArtistlist(20, 0, tag[1], selectLan, initial);
      console.log(res);
      setSelectType(tag[1]);
      setSinger(res.artists);
      setIsMore(res.more);
      setOffset(0);
    },
    [selectLan, selectType, selectZimu]
  );
  const mapType = useCallback(() => {
    return se.map((item) => {
      return (
        <span key={item[1]}>
          <CheckableTag
            key={item[1]}
            checked={selectType === item[1]}
            onChange={(check) => handleChangeType(item, check)}
          >
            {item[0]}
          </CheckableTag>
          <Divider type="vertical" />
        </span>
      );
    });
  }, [handleChangeType, selectType]);
  const handleChangeInit = useCallback(
    async (tag: string, check: boolean) => {
      if (selectZimu === tag) return;

      const initial =
        tag === "热门" ? "-1" : tag === "#" ? "0" : tag.toLowerCase();
      const res = await reqGetArtistlist(20, 0, selectType, selectLan, initial);
      setSelectZimu(tag);
      setSinger(res.artists);
      setIsMore(res.more);
      setOffset(0);
    },
    [selectLan, selectType, selectZimu]
  );
  const mapzimu = useCallback(() => {
    const arr: string[] = [];
    for (let i = 0; i < 26; i++) {
      arr.push(String.fromCharCode(i + 65));
    }
    arr.unshift("热门");
    arr.push("#");
    return arr.map((item) => {
      return (
        <span key={item}>
          <CheckableTag
            key={item}
            checked={selectZimu === item}
            onChange={(check) => handleChangeInit(item, check)}
          >
            {item}
          </CheckableTag>
          <Divider type="vertical" />
        </span>
      );
    });
  }, [handleChangeInit, selectZimu]);

  useEffect(() => {
    const getArtistList = async () => {
      const res = await reqGetArtistlist();

      setSinger(res.artists);
      setIsMore(res.more);
      setOffset((offset) => offset + 1);
    };
    getArtistList();
  }, []);
  const toSingerDetail = useCallback(
    (id: string) => {
      nav("/singerDetail", { state: id });
    },
    [nav]
  );

  const mapSinger = useCallback(() => {
    return singer.map((item) => {
      const { id, name, picUrl } = item;
      return (
        <div
          onClick={() => toSingerDetail(id)}
          className="singer_item"
          key={id}
        >
          <div>
            <img src={picUrl} alt="name" />
          </div>
          <div>{name}</div>
        </div>
      );
    });
  }, [singer, toSingerDetail]);
  const fetchData = async () => {
    const initial =
      selectZimu === "热门"
        ? "-1"
        : selectZimu === "#"
        ? "0"
        : selectZimu.toLowerCase();
    const res = await reqGetArtistlist(
      20,
      offset * 30,
      selectType,
      selectLan,
      initial
    );
    setSinger((singer) => [...singer, ...res.artists]);
    setOffset((offset) => offset + 1);
    setIsMore(res.more);
  };
  return (
    <div id="singerHeaderDiv" className="singerHeader">
      <div className="singerHeader_tag">
        <span style={{ marginRight: 8 }}>语种: </span>
        {maplang()}
      </div>
      <div className="singerHeader_tag" style={{ marginRight: 8 }}>
        <span> 分类：</span>
        {mapType()}
      </div>
      <div className="singerHeader_tag" style={{ marginRight: 8 }}>
        <span> 筛选：</span>
        {mapzimu()}
      </div>

      <div>
        <InfiniteScroll
          hasMore={isMore}
          loader={<Spin />}
          dataLength={singer.length}
          next={fetchData}
          scrollableTarget="singerHeaderDiv"
        >
          <div className="singerHeader_main"> {mapSinger()}</div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
