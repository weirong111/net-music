import React, { useEffect, useState } from "react";
import { reqGetVideoCategory, reqGetVideoList } from "../../../request";
import VideoItemOneContent from "./videoItemOneContent";
import VideoItemOneHeader from "./VideoItemOneHeader";

export default function VideoItemOne() {
  const [category, setCateGory] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [select, setSelect] = useState("全部视频");
  useEffect(() => {
    const GetList = async () => {
      const res1 = await reqGetVideoList();
      setList(res1.data);
      const res2 = await reqGetVideoCategory();
      setCateGory(res2.data);
      console.log(res2);
    };
    GetList();
  }, []);
  return (
    <div id="videoItemOne_target">
      <VideoItemOneHeader
        category={category}
        list={list}
        select={select}
        setSelect={setSelect}
        setCategory={setCateGory}
        setList={setList}
      />
      <VideoItemOneContent select={select} />
    </div>
  );
}
