import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import { useDrag } from "react-dnd";
import Context from "../../redux/store";
import {
  CaretRightOutlined,
  HeartOutlined,
  MenuOutlined,
  PauseOutlined,
  SoundOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { message, Slider, Space, Tooltip } from "antd";
import "./index.less";
import { reqCheckMusic, reqGetMp3, reqGetLyric } from "../../request";
import shunxu from "../../assets/song/shunxu.webp";
import PlayerDrawer from "./drawer";
import classNames from "classnames";
import { formatLyric } from "../../utils";

const Player = () => {
  const { state, dispatch } = useContext(Context);
  const {
    currentSong,
    isPlaying,
    songList,
    currentLyric,
    currentLyricPosition,
  } = state;
  const { id, name, al, dt, ar, st } = currentSong;
  const nav = useNavigate();
  const [visible, setVisible] = useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "lyric",
    collect: (mnoitor) => ({
      isDragging: !!mnoitor.isDragging(),
    }),
    end(target, mnoitor) {
      console.log(mnoitor.getClientOffset());
    },
  }));
  //设置播放方式
  /**
   * 1为顺序播放
   * 2为随机播放
   * 3为单曲循环
   */
  const [playStyle, setPlayStyle] = useState<number>(1);
  const playStyleRef = useRef<number>(1);
  const [, setPlayTime] = useState(0);
  const currentTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isDrag = useRef(false);
  const [lyricVisible, setlyricVisible] = useState(false);
  useEffect(() => {
    if (audioRef.current) {
      dispatch({ action: "SONG", type: "SETPLAYER", data: audioRef.current });
    }
  }, [dispatch, id]);
  const showDrawer = () => {
    setVisible(true);
  };

  const mapAr = useCallback(() => {
    if (typeof ar === "object") {
      const help = [];
      for (let item of ar) {
        help.push(item.name);
      }
      return help.join(" / ");
    }
  }, [ar]);
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play();
      dispatch({ action: "SONG", type: "SETISPLAYING", data: true });
    }
  };
  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      dispatch({ action: "SONG", type: "SETISPLAYING", data: false });
    }
  };
  const formatPlayTime = (time: number) => {
    time = time * 1000;
    return dayjs(time).format("mm:ss");
  };
  const getProgress = (time: number) => {
    if (!dt || time === 0) return 0;
    return 100 * parseFloat(((time * 1000) / parseInt(dt)).toFixed(2));
  };

  useEffect(() => {
    if (audioRef.current) {
      console.log("useEffect");
      const audio = audioRef.current;
      const fn = () => {
        console.log("canplay");
        if (isPlaying) audio.play();
        console.log(audio.volume);
      };
      audio.addEventListener("canplay", fn);
      const fn2 = () => {
        console.log("音频正在加载中");
      };
      audio.addEventListener("waiting", fn2);
      return () => {
        audio.removeEventListener("canplay", fn);
        audio.removeEventListener("waiting", fn2);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const fn = async () => {
        console.log("ended");
        currentTimeRef.current = 0;
        audio.currentTime = 0;

        const playS = playStyleRef.current;
        const index =
          playS === 1
            ? currentSong.index === songList.length - 1
              ? 0
              : currentSong.index + 1
            : playS === 2
            ? Math.floor(Math.random() * songList.length)
            : currentSong.index;
        const lastSong = songList[index];
        console.log(songList);
        if (lastSong.url === undefined) {
          const check = await reqCheckMusic(lastSong.id);
          if (!check.success) {
            message.warn(check.message);
            return;
          }
          const data = await reqGetMp3(lastSong.id);
          lastSong.url = data.data[0].url;
        }

        lastSong.index = index;
        dispatch({ action: "SONG", type: "SETCURRENTSONG", data: lastSong });
        getLyricAndFormat(lastSong.id);
      };
      audio.addEventListener("ended", fn);
      return () => {
        audio.removeEventListener("ended", fn);
        console.log("执行了清除函数");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch, songList]);

  const onChangeSlider = (newValue: number) => {
    isDrag.current = true;
    currentTimeRef.current = Math.round((dt * newValue) / 100 / 1000);
    setPlayTime(Math.round((dt * newValue) / 100 / 1000));
  };
  const onChangeAfterSlider = (newValue: number) => {
    const help = Math.round((dt * newValue) / 100 / 1000);
    currentTimeRef.current = help;
    if (audioRef.current && id) {
      audioRef.current.currentTime = help;
      setPlayTime(help);
    }
    isDrag.current = false;
  };

  const changeSong = async (type: string) => {
    const audio = audioRef.current;
    if (audio) {
      currentTimeRef.current = 0;
      audio.currentTime = 0;

      const index =
        type === "pre"
          ? currentSong.index === 0
            ? songList.length - 1
            : currentSong.index - 1
          : currentSong.index === songList.length - 1
          ? 0
          : currentSong.index + 1;
      const lastSong = songList[index];

      const check = await reqCheckMusic(lastSong.id);
      if (!check.success) {
        message.warn(check.message);
        return;
      }
      const data = await reqGetMp3(lastSong.id);
      lastSong.url = data.data[0].url;
      lastSong.index = index;
      dispatch({ action: "SONG", type: "SETCURRENTSONG", data: lastSong });
      getLyricAndFormat(lastSong.id);
    }
  };

  const changePlayStyle = (index: number) => {
    setPlayStyle(index);
    if (playStyleRef.current) {
      playStyleRef.current = index;
    }
  };

  const findLyric = (time: number) => {
    const help = currentLyric.findLast(
      (item: [number, string]) => item[0] < time * 1000
    );
    if (!help) return "";
    return help[1];
  };

  const getLyricAndFormat = async (id: string) => {
    const data = await reqGetLyric(id);
    const res = formatLyric(data.lrc.lyric);
    dispatch({ action: "SONG", type: "SETLYRIC", data: res });
  };

  useEffect(() => {
    let timer: NodeJS.Timer | undefined = undefined;
    let fun: (() => void) | undefined = undefined;

    if (audioRef.current) {
      const audio = audioRef.current;
      // fun = () => {
      timer = setInterval(() => {
        if (isDrag.current === false) {
          setPlayTime(audio.currentTime);

          currentTimeRef.current = audio.currentTime;
          dispatch({
            action: "SONG",
            type: "SETCURRENTTIME",
            data: audio.currentTime,
          });
        }
      }, 1000);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (audioRef.current) {
        const audio = audioRef;
        const cur = audio.current as HTMLAudioElement;
        clearInterval(timer);
        cur.removeEventListener("playing", fun as () => void);
      }
    };
  }, [id]);

  return (
    <div>
      <div className="player" key={id}>
        <div className="player_left">
          <div className="player_left_img">
            {al ? (
              <img onClick={() => nav("/detail")} src={al.picUrl} alt="" />
            ) : (
              ""
            )}
          </div>

          <div className="player_left_name">
            <div className="player_left_song">{name}</div>
            <div className="player_left_ar">{mapAr()}</div>
          </div>
          <div className="player_left_heart">
            <HeartOutlined
              style={{ fontSize: 20, color: st === 0 ? "" : "red" }}
            />
          </div>
        </div>
        <div className="player_center">
          <audio preload="auto" ref={audioRef}>
            <source src={currentSong.url} />
          </audio>
          <div className="player_center_icon">
            <Space size={20}>
              {playStyle === 1 ? (
                <Tooltip title="顺序播放">
                  <img onClick={() => changePlayStyle(2)} src={shunxu} alt="" />
                </Tooltip>
              ) : playStyle === 2 ? (
                <Tooltip title="随机播放">
                  <img
                    alt=""
                    onClick={() => changePlayStyle(3)}
                    src={require("../../assets/song/random.webp")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="单曲循环">
                  <img
                    onClick={() => changePlayStyle(1)}
                    src={require("../../assets/song/danqu.webp")}
                    alt=""
                  />
                </Tooltip>
              )}
              <StepBackwardOutlined
                onClick={() => changeSong("pre")}
                className="player_center_icon_item"
              />
              <div className="player_center_icon_item_wrap">
                {isPlaying ? (
                  <PauseOutlined
                    className="player_center_icon_item"
                    onClick={stopMusic}
                  />
                ) : (
                  <CaretRightOutlined
                    className="player_center_icon_item"
                    onClick={playMusic}
                  />
                )}
              </div>

              <StepForwardOutlined
                onClick={() => changeSong("last")}
                className="player_center_icon_item"
              />

              <div
                onClick={() => setlyricVisible((visible) => !visible)}
                className={classNames({
                  player_center_lyric: true,
                  select_lyric: lyricVisible,
                })}
              >
                词
              </div>
            </Space>
          </div>
          <div className="player_center_progress">
            <span className="player_center_progress_playTime">
              {formatPlayTime(currentTimeRef.current)}
            </span>
            <Slider
              onChange={onChangeSlider}
              disabled={!!!id}
              onAfterChange={onChangeAfterSlider}
              tooltipVisible={false}
              value={getProgress(currentTimeRef.current)}
            />
            <span>{dayjs(dt).format("mm:ss")}</span>
          </div>
        </div>

        <div className="player_right">
          <Space size={20}>
            <SoundOutlined />
            <MenuOutlined onClick={showDrawer} />
          </Space>
        </div>

        <PlayerDrawer visible={visible} setVisible={setVisible} />
      </div>
      <div
        ref={drag}
        style={{
          visibility: lyricVisible === false ? "hidden" : "visible",
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          position: "absolute",
          top: currentLyricPosition.y,
          left: currentLyricPosition.x,
        }}
        className="player_lyric"
      >
        {findLyric(currentTimeRef.current)}
      </div>
    </div>
  );
};

export default Player;
