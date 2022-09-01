import React, { useEffect, useState } from "react";
import { reqGetMenuHeader, reqGetToplist } from "../../../request";
import FourList from "./fourList";
import OtherLists from "./otherLists";
import "./index.less";
export default function RangingList() {
  const [playListup, setPlayListup] = useState([]);
  const [playListdown, setPlayListdown] = useState([]);
  useEffect(() => {
    const getToplist = async () => {
      const res = await reqGetToplist();
      console.log(res.list);
      setPlayListup(res.list.slice(0, 4));
      setPlayListdown(res.list.slice(4));
    };
    getToplist();
  }, []);

  return (
    <div className="rankList">
      <FourList playListup={playListup} />
      <OtherLists playListdown={playListdown} />
    </div>
  );
}
