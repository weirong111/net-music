import { RightOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import "./index.less";
import { reqGetrecommend } from "../../../request/index";
import RecommendSong from "./recommendMenu";
export default function Recommend() {
  const [recommend, setRecommend] = useState<{ [key: string]: string }[]>([]);
  useEffect(() => {
    const getRecommend = async () => {
      const res = await reqGetrecommend();
      console.log(res);
      setRecommend(res.result);
    };
    getRecommend();
  }, []);
  return (
    <div className="recommend">
      <div className="recommend_header">
        <span>推荐歌单</span>
        <span>
          <RightOutlined />
        </span>
      </div>
      <RecommendSong recommend={recommend} />
    </div>
  );
}
