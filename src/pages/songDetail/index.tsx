import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "animate.css";
import Context from "../../redux/store";
import { reqGetSimpplayList, reqGetHotComments } from "../../request/index";
import { Space, List, Tooltip, Comment } from "antd";
import "./index.less";
import play from "../../assets/play.png";
import aag from "../../assets/aag.png";
import classNames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { CaretRightOutlined, LikeOutlined } from "@ant-design/icons";

dayjs.extend(relativeTime);
const SongDetail = () => {
  const [simpPlayList, setsimpPlayList] = useState<any[]>([]);
  const { state } = useContext(Context);
  const {
    currentSong,
    currentLyric,
    isPlaying,

    currentTime,
    player,
  } = state;

  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getsimpPlayList = async () => {
      const res = await reqGetSimpplayList(currentSong.id);
      console.log(res.playlists);
      setsimpPlayList(res.playlists);
    };
    getsimpPlayList();
  }, [currentSong.id]);

  const mapsimiPlayLists = useCallback(() => {
    return simpPlayList.map((item) => {
      const { id, name, coverImgUrl } = item;
      return (
        <div className="simiPlaylistItem" key={id}>
          <img className="simiPlaylistItem_img" src={coverImgUrl} alt="" />
          <span className="simiPlaylistItem_name">{name}</span>
        </div>
      );
    });
  }, [simpPlayList]);

  const [hotComments, setHotComments] = useState<any>([]);
  const [totalComments, setTotalComments] = useState(20);
  useEffect(() => {
    const getHotCommects = async () => {
      const res = await reqGetHotComments(currentSong.id);
      console.log(res);
      setHotComments(res.hotComments);
      setTotalComments(res.total);
    };
    getHotCommects();
  }, [currentSong.id]);

  const getCurrentLyric = useCallback(() => {
    const help = currentLyric.findLastIndex(
      (item: [number, string]) => item[0] < currentTime * 1000
    );
    return help;
  }, [currentLyric, currentTime]);

  const changeTime = (time: number) => {
    if (player && player.ref) {
      console.log("do");
      console.log(time);
      const audio = player.ref;
      console.log(audio);
      audio.currentTime = time / 1000;
    }
  };

  const getWriter = useCallback(() => {
    const help = [];
    for (let item of currentSong.ar) {
      help.push(item.name);
    }
    return help.join(" / ");
  }, [currentSong.ar]);
  const getCurrentSong = () => {
    const help = currentLyric.filter((item: [number, string]) => !!item[1]);

    return help.map((item: [number, string], index: number) => {
      return (
        <div
          className={classNames({
            lyric_item: true,
            selectLyric: index === getCurrentLyric(),
          })}
          key={index}
        >
          <Space>
            <span> {item[1]}</span>

            <span
              className={classNames({
                lyric_item_time: index !== getCurrentLyric(),
                showTime: index === getCurrentLyric(),
              })}
            >
              {dayjs(item[0]).format("mm:ss")}
              <CaretRightOutlined onClick={() => changeTime(item[0])} />
            </span>
          </Space>
        </div>
      );
    });
  };

  const getHotCommects = async (offset: number) => {
    const res = await reqGetHotComments(currentSong.id, offset);
    console.log(res, "com");
    setHotComments((value: any[]) => [...value, ...res.hotComments]);
  };

  return (
    <div ref={domRef} className="songDetail_total">
      <div className="songDetail animate__backInUp">
        <div className="songDetail_left">
          <div>
            <img
              className={classNames({
                songDetail_left_aag: true,
                songDetailPlaying: isPlaying,
              })}
              src={aag}
              alt=""
            />
          </div>
          <div>
            <div
              className={classNames({
                songDetail_twoImg: true,
              })}
            >
              <img
                className={classNames({
                  songDetail_left_play: true,
                  circleSelected: isPlaying,
                })}
                src={play}
                alt=""
              ></img>
              <img
                className={classNames({
                  songDetail_songimg: true,
                  circleSelected: isPlaying,
                })}
                src={currentSong.al.picUrl}
                alt=""
              ></img>
            </div>
          </div>
        </div>
        <div className="songDetail_center">
          <div className="songDetail_center_song">{currentSong.name}</div>
          <div className="songDetail_center_writer">{getWriter()}</div>

          <div ref={domRef} className="songDetail_center_lyric">
            <Space direction="vertical">{getCurrentSong()}</Space>
          </div>
        </div>
        <div className="songDetail_right">
          <h3> 推荐歌单 </h3>
          <div className="simplePlaylist">
            <Space direction="vertical">{mapsimiPlayLists()}</Space>
          </div>
        </div>
      </div>
      <div className="songDetail_bottom">
        <List
          header={<h3>热门推荐</h3>}
          size="small"
          pagination={{
            showSizeChanger: false,
            pageSize: 20,
            showQuickJumper: true,
            total: totalComments,
            onChange: getHotCommects,
            position: "bottom",
          }}
          dataSource={hotComments}
          style={{ width: "50%" }}
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
    </div>
  );
};

export default SongDetail;
