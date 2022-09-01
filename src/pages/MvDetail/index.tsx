import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.less";
import {
  reqGetDetailMv,
  reqGetSimiMv,
  reqGetMvDetail,
  reqGetMvComment,
} from "../../request/index";
import dayjs from "dayjs";
import { BigPlayButton, Player } from "video-react";
import {
  CaretRightOutlined,
  DownloadOutlined,
  FolderAddOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, List, Space, Tooltip, Comment } from "antd";

const MvDetail = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [simiMv, setsimiMv] = useState<any[]>([]);
  const [url, setUrl] = useState<{ url: string }>({
    url: "",
  });
  const [total, setTotal] = useState(0);
  const [comment, setComments] = useState<any[]>([]);
  const [info, setInfo] = useState<{ [key: string]: any }>({});
  useEffect(() => {
    const getMv = async () => {
      if (!location.state) {
        nav("/");
      }
      sessionStorage.setItem("mvId", location.state as string);
      const id = location.state as string;
      const res = await reqGetSimiMv(id);
      const res2 = await reqGetMvDetail(id);
      setsimiMv(res.mvs);

      setInfo(res2.data as { [key: string]: any });
    };
    getMv();
  }, [location, nav]);

  useEffect(() => {
    const getVideoUrl = async () => {
      if (!location.state) {
        nav("/");
      }
      const id = location.state as string;
      const res = await reqGetDetailMv(id);
      console.log(res);
      setUrl(res.data as { url: string });
    };
    getVideoUrl();
  }, [location.state, nav]);

  useEffect(() => {
    const getHotCommects = async () => {
      if (!location.state) {
        nav("/");
      }
      const id = location.state as string;
      const res = await reqGetMvComment(id);
      console.log(res, "com");
      setTotal(res.total);
      setComments(res.comments);
    };
    getHotCommects();
  }, [location.state, nav]);

  const getHotCommects = async (offset: number) => {
    const res = await reqGetMvComment(
      (location.state as string) || (sessionStorage.getItem("mvid") as string),
      offset
    );
    console.log(res, "com");
    setComments((value: any[]) => [...value, ...res.hotComments]);
  };

  const mapSimpMv = useCallback(() => {
    return simiMv.map((item) => {
      return (
        <div
          onClick={() => nav("/mvDetail", { state: item.id })}
          key={item.id}
          className="simiMv"
        >
          <div className="item_up">
            <div className="item_up_wrap">
              <img className="mv_img" src={item.cover} alt="" />
              <div className="mv_time">
                {dayjs(item.duration).format("mm:ss")}
              </div>
              <div className="mv_playCount">
                <CaretRightOutlined />
                {item.playCount < 10000
                  ? item.playCount
                  : `${Math.floor(item.playCount / 10000)}万`}
              </div>
            </div>
          </div>
          <div className="item_down">
            <div className="item_down_name">{item.name}</div>
            <div className="item_down_artistName">by {item.artistName}</div>
          </div>
        </div>
      );
    });
  }, [nav, simiMv]);
  return (
    <div className="mvDetail">
      <div className="mvDetail_left">
        <div className="mvDetail_left_title">MV详情</div>
        <Player fluid preload="auto" aspectRatio="16:9" src={url.url} autoPlay>
          <BigPlayButton position="center" />
        </Player>
        <div className="mvDetail_left_info">
          <div className="mvDetail_left_info_name">{info.name}</div>
          <div className="mvDetail_left_info_other">
            <Space>
              <span>发布 {info.publishTime}</span>
              <span>
                播放{" "}
                {info.playCount > 10000
                  ? `${Math.floor(info.playCount / 10000)}万`
                  : info.playCount}
              </span>
            </Space>
          </div>
        </div>
        <div className="mvDetail_left_info_action">
          <Space size={15}>
            <Button shape="round" icon={<LikeOutlined />}>
              赞(5546)
            </Button>
            <Button shape="round" icon={<FolderAddOutlined />}>
              收藏(392)
            </Button>
            <Button shape="round" icon={<ShareAltOutlined />}>
              分享(708)
            </Button>
            <Button shape="round" icon={<DownloadOutlined />}>
              下载MV
            </Button>
          </Space>
        </div>
        <List
          header={<h3>精彩评论</h3>}
          size="small"
          pagination={{
            showSizeChanger: false,
            pageSize: 20,
            showQuickJumper: true,
            total: total,
            onChange: getHotCommects,
            position: "bottom",
          }}
          dataSource={comment}
          renderItem={(item: any) => (
            <List.Item key={item.commentId}>
              <Comment
                actions={[
                  <span>
                    <LikeOutlined /> {item.likedCount}
                  </span>,
                ]}
                datetime={
                  <Tooltip title={item.timeStr}>
                    <span>{dayjs(item.time).fromNow()}</span>
                  </Tooltip>
                }
                author={item.user.nickname}
                avatar={item.user.avatarUrl}
                content={item.content}
              >
                {item.beReplied.length &&
                  item.beReplied.map((item: any) => {
                    return (
                      <Comment
                        key={item.beRepliedCommentId}
                        author={item.user.nickname}
                        avatar={item.user.avatarUrl}
                        content={item.content}
                      ></Comment>
                    );
                  })}
              </Comment>
            </List.Item>
          )}
        ></List>
      </div>
      <div className="mvDetail_right">
        <div className="mvDetail_right_title">相关推荐</div>
        {mapSimpMv()}
      </div>
    </div>
  );
};

export default MvDetail;
