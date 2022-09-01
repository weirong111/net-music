import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reqGetMenuAll } from "../../request";
import SongListDetail from "../songList/songListDetail";
import SongListHeader from "../songList/songListHeader";
import "./index.less";
export default function MyCreateSongList() {
  const param = useParams();
  const nav = useNavigate();
  const [allSongs, setAllSongs] = useState<any[]>([]);
  useEffect(() => {
    console.log(param);
    const reqGetSong = async () => {
      if (!param.id) nav("/");
      const Songs = await reqGetMenuAll(param.id as string);
      setAllSongs(Songs.songs);
    };
    reqGetSong();
  }, [nav, param]);
  return (
    <div className="myCreateSongList">
      <SongListHeader id={param.id as string} />
      <SongListDetail allSongs={allSongs} />
    </div>
  );
}
