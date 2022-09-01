import { Space, Tag } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { reqGetMvSubList } from "../../../request";
import "./index.less";
import { CaretRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
export default function MyVideo() {
  const [mv, setMv] = useState<any[]>([]);
  const nav = useNavigate();
  useEffect(() => {
    const getMv = async () => {
      const res = await reqGetMvSubList();
      console.log(res);
      setMv(res.data);
    };
    getMv();
  }, []);
  const toMvDetail = (id: string) => {
    nav("/mvDetail", { state: id });
  };
  const mapMv = useCallback(() => {
    return mv.map((item) => {
      return (
        <div
          onClick={() => toMvDetail(item.vid)}
          key={item.vid}
          className="myVideo_item"
        >
          <div className="myVideo_item_cover">
            <img src={item.coverUrl} alt="" />
            <div className="myVideo_item_tag">
              <CaretRightOutlined />{" "}
              <span>
                {item.playTime > 10000
                  ? `${Math.floor(item.playTime / 10000)}万`
                  : item.playTime}
              </span>
            </div>
          </div>
          <div>
            <Space>
              {item.type === 0 && <Tag color="#F07070">MV</Tag>}
              <span className="myVideo_item_title">{item.title}</span>
            </Space>
          </div>
          <div>
            <Space>
              {item.creator.map((item2: any) => (
                <span className="myVideo_item_artist" key={item2.userId}>
                  {item2.userName}
                </span>
              ))}
            </Space>
          </div>
        </div>
      );
    });
  }, [mv]);

  return (
    <div className="myVideo">
      <Space>
        <span style={{ fontSize: 24, fontWeight: 600, margin: 10 }}>
          收藏的视频
        </span>
        <span style={{ color: "#888" }}>({mv.length})</span>
      </Space>
      <div className="myVideo_content">{mapMv()}</div>
    </div>
  );
}
