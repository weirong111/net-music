import { RightOutlined } from "@ant-design/icons";
import { message, Space, Table } from "antd";
import dayjs from "dayjs";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import Context from "../../../../redux/store";
import {
  reqCheckMusic,
  reqGetLyric,
  reqGetMenuHeader,
  reqGetMp3,
} from "../../../../request";
import { formatLyric } from "../../../../utils";
import "./index.less";

type Iprops = {
  playListup: any[];
};

const FourList: FC<Iprops> = ({ playListup }) => {
  const { state, dispatch } = useContext(Context);
  const { currentSong, player } = state;
  const columns = useCallback(
    () => [
      {
        key: "id",
        render: (record: any) => {
          console.log(record);
          return (
            <div className="song_title">
              <span>{record.name}</span>
              {record.alia.length > 0 ? <span>{record.alia[0]}</span> : ""}
            </div>
          );
        },
      },
      {
        render: (record: any) => {
          return (
            <Space>
              {record.ar.map((item: any) => {
                return (
                  <span className="song_desc" key={item.id}>
                    {item.name}
                  </span>
                );
              })}
            </Space>
          );
        },
      },
      // {
      //     title:"xxx2",
      //     key='id',
      //     render:(record)

      // }
    ],
    []
  );
  const [currentTracks, setCurrentTracks] = useState<any[][]>([]);
  useEffect(() => {
    const getTracks = () => {
      playListup.forEach(async (item, index) => {
        const res = await reqGetMenuHeader(item.id);
        console.log();
        setCurrentTracks((tracks) => {
          const newTracks = [...tracks];
          newTracks[index] = res.playlist.tracks.slice(0, 5);
          return newTracks;
        });
      });
    };
    getTracks();
  }, [playListup]);
  const nav = useNavigate();
  const getLyricAndFormat = useCallback(
    async (id: string) => {
      const data = await reqGetLyric(id);
      const res = formatLyric(data.lrc.lyric);
      dispatch({ action: "SONG", type: "SETLYRIC", data: res });
    },
    [dispatch]
  );
  const clickSongs = useCallback(
    async (record: { [key: string]: any }, index: number) => {
      if (record.id === currentSong.id) return;
      const check = await reqCheckMusic(record.id);
      if (!check.success) {
        message.warn(check.message);
        return;
      }
      const data = await reqGetMp3(record.id);
      localStorage.setItem(record.id, data.data[0].url);
      record.url = data.data[0].url;
      record.index = index;
      dispatch({ action: "SONG", type: "SETCURRENTSONG", data: record });
      if (player && player.ref) {
        const audio = player.ref;
        audio.load();
      }
      dispatch({ action: "SONG", type: "SETISPLAYING", data: true });
      getLyricAndFormat(record.id);
    },
    [currentSong.id, dispatch, getLyricAndFormat, player]
  );
  const toSongList = useCallback(
    (id: string) => {
      nav("/songList", { state: { id } });
    },
    [nav]
  );
  const mapPlayLists = useCallback(() => {
    return playListup.map((item, index) => {
      console.log(currentTracks);
      return (
        <div key={item.id} className="playLists_item">
          <div className="playLists_item_left">
            <img src={item.coverImgUrl} alt={item.description} />

            <div>{dayjs(item.updateTime).format("MM-DD")}更新</div>
          </div>
          <div className="playLists_item_right">
            <Table
              rowClassName={(record, index) => {
                const classname1 =
                  record.id === currentSong.id ? "selectRow" : "";
                const classname2 = index % 2 === 0 ? "even" : "odd";
                return `${classname1} ${classname2}`;
              }}
              onRow={(record, index) => {
                return {
                  onClick: (e) => clickSongs(record, index as number),
                };
              }}
              showHeader={false}
              size="small"
              className="playLists_item_right_table"
              pagination={false}
              style={{ width: "100%" }}
              columns={columns()}
              dataSource={currentTracks[index]}
            />
            <span onClick={() => toSongList(item.id)} className="song_all">
              查看全部 <RightOutlined />
            </span>
          </div>
        </div>
      );
    });
  }, [
    clickSongs,
    columns,
    currentSong.id,
    currentTracks,
    playListup,
    toSongList,
  ]);

  return (
    <div className="fourList">
      <div style={{ fontWeight: 600, fontSize: 18 }}>官方榜</div>
      {mapPlayLists()}
    </div>
  );
};

export default FourList;
