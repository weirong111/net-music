import React, { useContext, memo, FC } from "react";
import { Drawer, message, Space, Table } from "antd";
import { MedicineBoxOutlined } from "@ant-design/icons";
import Context from "../../../redux/store";
import "./index.less";
import dayjs from "dayjs";
import { reqCheckMusic, reqGetMp3 } from "../../../request";
const columns = [
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

type Iprops = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
const PlayerDrawer: FC<Iprops> = ({ visible, setVisible }) => {
  const { state, dispatch } = useContext(Context);
  const { currentSong, songList, player } = state;
  const onClose = () => {
    setVisible(false);
  };
  const clickSongs = async (record: { [key: string]: any }, index: number) => {
    if (record.id === currentSong.id) return;
    setVisible(false);
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
  };

  return (
    <div>
      <Drawer
        width={500}
        className="drawer"
        title="当前播放"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <div className="drawer_content">
          <Space size={200}>
            <span style={{ color: "#DADADA" }}>总{songList.length}首</span>
            <Space>
              <span className="collect">
                <MedicineBoxOutlined /> 收藏全部
              </span>
            </Space>
          </Space>
          <Table
            rowKey="id"
            className="drawer_table"
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
            size="small"
            pagination={false}
            columns={columns}
            dataSource={songList}
          ></Table>
        </div>
      </Drawer>
    </div>
  );
};

export default memo(PlayerDrawer, () => {
  return false;
});
