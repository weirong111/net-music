import { HeartOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, message, Space, Spin, Table } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import Context from "../../redux/store";
import {
  reqCheckMusic,
  reqGetLyric,
  reqGetMp3,
  reqGetRecentSong,
} from "../../request";
import { formatLyric } from "../../utils";
import "./index.less";
export default function RecentSong() {
  const [allSongs, setAllsongs] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    const getSong = async () => {
      const res = await reqGetRecentSong(100);
      console.log(res);
      const arr = (res.data as { list: any[]; total: number }).list;
      const help = [];
      for (const item of arr) {
        help.push(item.data);
      }

      setAllsongs(help);

      setTotal((res.data as { list: any[]; total: number }).total);
    };
    getSong();
  }, []);
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
  const { state, dispatch } = useContext(Context);
  const { currentSong, player } = state;
  const clickSongs = async (record: { [key: string]: any }, index: number) => {
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
  return (
    <div className="recentSong">
      <div className="recentSong_title">
        <Space>
          <span className="recentSong_title_play">最近播放</span>{" "}
          <span className="recentSong_title_number">共{total}首</span>
          <span>
            <Button
              type="link"
              onClick={() => message.info("暂未实现敬请期待")}
            >
              清空列表
            </Button>
          </span>
        </Space>
      </div>
      <div>
        <div className="songListDetail">
          <Table
            rowKey="id"
            rowClassName={(record, index) => {
              const classname1 =
                record.id === currentSong.id ? "selectRow" : "";
              const classname2 = index % 2 === 0 ? "even" : "odd";
              return `${classname1} ${classname2}`;
            }}
            size="small"
            onRow={(record, index) => {
              return {
                onClick: (e) => clickSongs(record, index as number),
              };
            }}
            pagination={false}
            dataSource={allSongs}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
}
