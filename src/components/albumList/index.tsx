import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { reqGetAlbumDetail } from "../../request";
import AlbumListDetail from "./albumDetail";
import AlbumHeader from "./albumListHeader";
import "./index.less";
const AlbumList = () => {
  const location = useLocation();
  const [songs, setSongs] = useState<any[]>([]);
  const [album, setAlbum] = useState<{
    [key: string]: any;
  }>({
    picUrl: "",
    name: "",
    artists: [],
    publishTime: "",

    info: {
      shareCount: 0,
    },
  });
  const checkValid = useCallback(() => {
    const id = location.state || sessionStorage.getItem("album");
    return id ? id : null;
  }, [location.state]);
  useEffect(() => {
    const getAlbum = async () => {
      const id = checkValid();
      if (id) {
        const res = await reqGetAlbumDetail(id as number);
        console.log(res);
        setSongs(res.songs);
        setAlbum(res.album);
      }
    };
    getAlbum();
  }, [checkValid]);

  return (
    <div className="albumList">
      <AlbumHeader album={album} />
      <AlbumListDetail allSongs={songs} />
    </div>
  );
};

export default AlbumList;
