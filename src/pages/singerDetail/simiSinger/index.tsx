import React, { useCallback, useEffect, useState } from "react";
import { reqGetSimiSinger } from "../../../request";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.less";
const SimiSinger = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [artist, setArtist] = useState<any[]>([]);
  const checkValid = useCallback(() => {
    if (!!location.state || !!sessionStorage.getItem("singerDetail")) {
      return location.state || sessionStorage.getItem("singerDetail");
    }
    return null;
  }, [location.state]);
  useEffect(() => {
    const getSimiSinger = async () => {
      const id = checkValid();
      if (id) {
        const res = await reqGetSimiSinger(id as string);
        setArtist(res.artists);
      }
    };
    getSimiSinger();
  }, [checkValid]);

  const handleOnclick = (singer: any) => {
    nav("/singerDetail", { state: singer.id });
  };

  const mapArtist = useCallback(() => {
    return artist.map((item) => {
      return (
        <div
          onClick={() => handleOnclick(item)}
          key={item.id}
          className="simiSinger_item"
        >
          <img className="simiSinger_item_img" src={item.picUrl} alt="" />
          <div>{item.name}</div>
        </div>
      );
    });
  }, [artist]);

  return <div className="simiSinger">{mapArtist()}</div>;
};

export default SimiSinger;
