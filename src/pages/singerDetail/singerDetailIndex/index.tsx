import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.less";
import {
  reqCheckMusic,
  reqGetLyric,
  reqGetMp3,
  reqSingerTopSong,
  reqGetSingerAlbum,
} from "../../../request/index";
import { message, Space, Spin, Table } from "antd";
import { HeartOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Context from "../../../redux/store";
import { formatLyric } from "../../../utils";
import AulbmItem from "../aulbmItem";

export default function SingDetailIndex() {
  const columns = [
    {
      title: "操作",
      render: (record: any) => (
        <Space>
          <HeartOutlined />
          <DownloadOutlined onClick={(e) => downLoadSong(e, record)} />
        </Space>
      ),
    },

    {
      title: "标题",
      dataIndex: "name",
      render: (text: string) => <div className="song_title">{text}</div>,
    },
    {
      title: "歌手",
      dataIndex: "ar",
      render: (text: any[]) => {
        const help = new Array<string>();
        for (let item of text) {
          help.push(item.name);
        }

        return <div className="song_desc ">{help.join(" / ")}</div>;
      },
    },
    {
      title: "专辑",
      dataIndex: "al",
      render: (text: any) => <div className="song_desc">{text.name}</div>,
    },
    {
      title: "时间",
      dataIndex: "dt",
      render: (text: string) => (
        <div className="song_desc">{dayjs(text).format("mm:ss")}</div>
      ),
    },
  ];
  const location = useLocation();
  const nav = useNavigate();
  const [allSongs, setAllSongs] = useState<any>([]);
  const [allAlbum, setAllalbum] = useState<any[]>([]);
  useEffect(() => {
    const getHotFifty = async () => {
      const res = await reqSingerTopSong(
        (location.state as string) ||
          (sessionStorage.getItem("singerDetail") as string)
      );
      const res2 = await reqGetSingerAlbum(
        (location.state as string) ||
          (sessionStorage.getItem("singerDetail") as string)
      );

      setAllalbum(res2.hotAlbums);

      setAllSongs(res.songs);
    };
    getHotFifty();
  }, [location.state]);

  const mapItemAlbums = useCallback(() => {
    return allAlbum.map((item: { id: number }) => {
      return <AulbmItem id={item.id} />;
    });
  }, [allAlbum]);

  const { state, dispatch } = useContext(Context);
  const { currentSong, player, songList } = state;
  const clickSongs = async (record: { [key: string]: any }, index: number) => {
    if (record.id === currentSong.id) return;
    if (allSongs !== songList)
      dispatch({ action: "SONG", type: "SETSONGLIST", data: allSongs });
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
  };
  const getLyricAndFormat = async (id: string) => {
    const data = await reqGetLyric(id);
    const res = formatLyric(data.lrc.lyric);
    dispatch({ action: "SONG", type: "SETLYRIC", data: res });
  };

  const downLoadSong = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    record: any
  ) => {
    e.stopPropagation();
    message.loading("开始下载");
    let url;
    if (record.url) {
      url = record.url;
    } else {
      const data = await reqGetMp3(record.id);
      url = data.data[0].url;
    }
    fetch(url).then((res) => {
      res.blob().then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${record.id}.mp3`;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        message.success("下载完成");
      });
    });
  };
  return allSongs.length === 0 ? (
    <Spin tip="Loading..." />
  ) : (
    <div>
      <div className="item_album">
        <div>
          <div style={{ marginBottom: 20, fontSize: 20, fontWeight: 500 }}>
            热门50首
          </div>
          <img
            style={{ width: 150, height: 150 }}
            src="https://p2.music.126.net/4E5b_0eDTiMCzYKiVSAerw==/19165587184063665.jpg"
            alt=""
          ></img>
        </div>

        <Table
          rowKey="id"
          rowClassName={(record, index) => {
            const classname1 = record.id === currentSong.id ? "selectRow" : "";
            const classname2 = index % 2 === 0 ? "even" : "odd";
            return `${classname1} ${classname2}`;
          }}
          size="small"
          onRow={(record, index) => {
            return {
              onClick: (e) => clickSongs(record, index as number),
            };
          }}
          pagination={{
            total: 50,
            pageSize: 10,

            size: "small",
            hideOnSinglePage: true,
          }}
          dataSource={allSongs}
          columns={columns}
          style={{ width: "75%" }}
        />
      </div>
      {mapItemAlbums()}
    </div>
  );
}
