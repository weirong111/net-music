import { CaretRightOutlined } from "@ant-design/icons";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";

type Iprops = {
  playListdown: any[];
};
const OtherLists: FC<Iprops> = ({ playListdown }) => {
  const nav = useNavigate();
  const toSongList = useCallback(
    (id: any) => {
      nav("/songList", { state: { id } });
    },
    [nav]
  );
  const mapPlayListDown = useCallback(() => {
    return playListdown.map((item: any) => {
      const { id, name, playCount } = item;
      return (
        <div
          onClick={() => toSongList(item.id)}
          className="otherLists_item"
          key={id}
        >
          <div className="otherLists_item_top">
            <img src={item.coverImgUrl} alt={name} />

            <div className="otherLists_item_top_playCount">
              <CaretRightOutlined />
              <span>
                {playCount > 1e9
                  ? `${Math.floor(playCount / 1e9)}亿`
                  : playCount > 10000
                  ? `${Math.floor(playCount / 10000)}万`
                  : playCount}
              </span>
            </div>
          </div>
          <div className="otherLists_item_bottom">{name}</div>
        </div>
      );
    });
  }, [playListdown, toSongList]);

  return (
    <div className="otherLists">
      <div className="playListdown_title">全球榜</div>
      <div className="playListdown_main">{mapPlayListDown()}</div>
    </div>
  );
};

export default OtherLists;
