import React, { useEffect } from "react";

import { reqGetArtistlist } from "../../../request";
import SingerHeader from "./singerHeader";

import "./index.less";
export default function Singer() {
  useEffect(() => {
    const getTopSinger = async () => {
      const res = await reqGetArtistlist();
      console.log(res);
    };
    getTopSinger();
  }, []);
  return (
    <div className="singer">
      <SingerHeader />
    </div>
  );
}
