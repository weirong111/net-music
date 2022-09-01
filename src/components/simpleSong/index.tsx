import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  reqCheckMusic,
  reqGetLyric,
  reqGetMp3,
  reqSearchResult,
} from "../../request";
import { message, Space, Table } from "antd";
import dayjs from "dayjs";
import { DownloadOutlined, HeartOutlined } from "@ant-design/icons";
import Context from "../../redux/store";
import { formatLyric } from "../../utils";
import "./index.less";

const SimpleSong = () => {
  const { state, dispatch } = useContext(Context);
  const { currentSong, player, songList } = state;
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
  const [allSongs, setAllSongs] = useState<any>([]);
  const [totalComments, setTotalComments] = useState(0);

  const clickSongs = async (record: { [key: string]: any }, index: number) => {
    console.log(songList);
    console.log(currentSong);
    if (allSongs !== songList)
      dispatch({ action: "SONG", type: "SETSONGLIST", data: allSongs });
    if (record.id === currentSong.id) return;
    const check = await reqCheckMusic(record.id);
    if (!check.success) {
      message.warn(check.message);
      return;
    }
    const data = await reqGetMp3(record.id);
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

  const getSongs = async (page: number) => {
    const res = await reqSearchResult(location.state as string, 1, 10, page);
    setAllSongs((value: any[]) => [...value, ...res.result.songs]);
  };

  useEffect(() => {
    console.log(location.state);
    const getSearch = async () => {
      const res = await reqSearchResult(
        (location.state as string) ||
          (sessionStorage.getItem("search") as string),
        1
      );
      setAllSongs(res.result.songs);
      setTotalComments(res.result.songCount);
      console.log(res.result.songCount);
    };
    getSearch();
  }, [location.state]);
  return (
    <div className="simpleSong">
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
        dataSource={allSongs}
        columns={columns}
        pagination={{
          showSizeChanger: false,
          pageSize: 10,
          showQuickJumper: true,
          total: totalComments,
          onChange: getSongs,
        }}
      ></Table>
    </div>
  );
};

export default SimpleSong;
