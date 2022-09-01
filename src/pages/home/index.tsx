import { useContext, useEffect } from "react";
import Headers from "../../components/Headers";
import "animate.css";
import "./index.less";
import { Outlet } from "react-router-dom";
import Player from "../../components/players";
import { useDrop } from "react-dnd";
import Context from "../../redux/store";
import { reqGetmyLikeList } from "../../request/index";

export default function Home() {
  const { _, dispatch } = useContext(Context);
  const [, drops] = useDrop(() => ({
    accept: "lyric",
    drop: (item, minoter) => {
      const help = minoter.getClientOffset();
      dispatch({ action: "SONG", type: "SERLYRIC", data: help });
    },
  }));

  useEffect(() => {
    const fun = async () => {
      const res = await reqGetmyLikeList();
      console.log(res);
    };
    fun();
  }, []);

  return (
    <div ref={drops}>
      <div>
        <Headers />
        <Outlet />
      </div>
      <Player />
    </div>
  );
}
