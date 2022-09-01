import { CaretRightOutlined } from "@ant-design/icons";
import { Pagination } from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { reqGetTopPlayList } from "../../../../request";
import "./index.less";
type Iprops = {
  tag: string;
};
const SongMenusContent: FC<Iprops> = ({ tag }) => {
  const [playlist, setPlayList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const nav = useNavigate();
  useEffect(() => {
    const reqGetPlayList = async () => {
      const res = await reqGetTopPlayList("hot", tag, 52);
      console.log(res);
      setPlayList(res.playlists);
      setTotal(res.total);
    };
    reqGetPlayList();
  }, [tag]);
  const handlePaChange = async (pageSize: number) => {
    const res = await reqGetTopPlayList("hot", tag, 52, (pageSize - 1) * 50);
    setPlayList(res.playlists);
  };

  const toSongList = useCallback(
    (id: string) => {
      nav("/songList", { state: { id } });
    },
    [nav]
  );
  const mapPlayLists = useCallback(() => {
    return playlist.map((item) => {
      return (
        <div
          onClick={() => toSongList(item.id)}
          key={item.id}
          className="songMenusContent_item"
        >
          <div className="songMenusContent_item_up">
            <img src={item.coverImgUrl} alt="" />
            <div className="songMenusContent_item_up_topRight">
              <span>
                <CaretRightOutlined />
              </span>
              <span>
                {item.playCount > 10000
                  ? `${Math.floor(item.playCount / 10000)}万`
                  : item.playCount}
              </span>
            </div>
            <div className="songMenusContent_item_up_leftBottom">
              {item.creator.nickname}
            </div>
          </div>
          <div className="songMenusContent_item_down">{item.name}</div>
        </div>
      );
    });
  }, [playlist, toSongList]);
  return (
    <div className="songMenusContent">
      <div className="songMenusContent_main">{mapPlayLists()}</div>
      <div className="songMenusContent_main_pa">
        <Pagination
          size="small"
          onChange={handlePaChange}
          showSizeChanger={false}
          hideOnSinglePage={true}
          pageSize={50}
          defaultCurrent={1}
          total={total}
        />
      </div>
    </div>
  );
};

export default React.memo(SongMenusContent);
