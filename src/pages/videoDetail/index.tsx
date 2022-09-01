import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.less";
import {
  reqGetRelatedVideo,
  reqGetVideoDetail,
  reqGetVideoUrl,
  reqGetVideoComment,
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

const VideoDetail = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [simiMv, setsimiMv] = useState<any[]>([]);
  const [url, setUrl] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [comment, setComments] = useState<any[]>([]);
  const [info, setInfo] = useState<{ [key: string]: any }>({});
  useEffect(() => {
    const getVideo = async () => {
      if (!location.state) {
        console.log(location);
        nav("/");
        return;
      }
      sessionStorage.setItem("videoId", location.state as string);
      const id = location.state as string;
      const res = await reqGetRelatedVideo(id);
      const res2 = await reqGetVideoDetail(id);
      setsimiMv(res.data);
      setInfo(res2.data as { [key: string]: any });
      setTotal(res2.data.commentCount);
    };
    getVideo();
  }, [location, nav]);

  useEffect(() => {
    const getVideoUrl = async () => {
      if (!location.state) {
        nav("/");
        return;
      }
      const id = location.state as string;
      const res = await reqGetVideoUrl(id);
      setUrl(res.urls[0].url);
    };
    getVideoUrl();
  }, [location.state, nav]);

  useEffect(() => {
    const getHotCommects = async () => {
      if (!location.state) {
        nav("/");
        return;
      }
      const id = location.state as string;
      const res = await reqGetVideoComment(id);
      console.log(res, "com");

      setComments(res.hotComments);
    };
    getHotCommects();
  }, [location.state, nav]);

  const getHotCommects = async (offset: number) => {
    const res = await reqGetVideoComment(
      (location.state as string) || (sessionStorage.getItem("mvid") as string),
      20,
      (offset - 1) * 20
    );
    console.log(res, "com");
    setComments((value: any[]) => [...value, ...res.hotComments]);
  };

  const mapSimpMv = useCallback(() => {
    return simiMv.map((item) => {
      const { vid } = item;
      return (
        <div
          onClick={() => nav("/videoDetail", { state: vid })}
          key={vid}
          className="simiMv"
        >
          <div className="item_up">
            <div className="item_up_wrap">
              <img className="mv_img" src={item.coverUrl} alt="" />
              <div className="mv_time">
                {dayjs(item.durationms).format("mm:ss")}
              </div>
              <div className="mv_playCount">
                <CaretRightOutlined />
                {item.playTime < 10000
                  ? item.playTime
                  : `${Math.floor(item.playTime / 10000)}万`}
              </div>
            </div>
          </div>
          <div className="item_down">
            <div className="item_down_name">{item.title}</div>
            <div className="item_down_artistName">
              by {item.creator[0].userName}
            </div>
          </div>
        </div>
      );
    });
  }, [nav, simiMv]);
  return (
    <div className="mvDetail">
      <div className="mvDetail_left">
        <div className="mvDetail_left_title">MV详情</div>
        <Player fluid preload="auto" aspectRatio="16:9" src={url} autoPlay>
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
              赞({info.praisedCount})
            </Button>
            <Button shape="round" icon={<FolderAddOutlined />}>
              收藏({info.subscribeCount})
            </Button>
            <Button shape="round" icon={<ShareAltOutlined />}>
              分享({info.shareCount})
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

export default VideoDetail;
