import React, { useContext, useEffect, useState } from "react";
import SongListDetail from "./songListDetail";
import SongListHeader from "./songListHeader";
import { useLocation } from "react-router-dom";
import { reqGetMenuAll } from "../../request/index";
import "./index.less";
import Context from "../../redux/store";
const SongList = () => {
  const location = useLocation();
  const [allSongs, setAllSongs] = useState<any[]>([]);
  const { dispatch } = useContext(Context);
  useEffect(() => {
    async function getMenuAll() {
      const Songs = await reqGetMenuAll((location.state as any).id);
      setAllSongs(Songs.songs);
      dispatch({ type: "SETSONGLIST", action: "SONG", data: Songs.songs });
    }
    getMenuAll();
  }, [dispatch, location.state]);
  return (
    <div className="songList">
      <SongListHeader id={(location.state as any).id} />
      <SongListDetail allSongs={allSongs} />
    </div>
  );
};

export default SongList;
