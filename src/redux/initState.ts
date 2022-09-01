export interface init {
  songList: any[];
  isPlaying: false;
  [key: string]: any;

  currentSong: {
    index: number;
    id: number;
    name: string;
    ar: Array<{
      name: string;
    }>;
    al: {
      picUrl: string;
      name: string;
    };
    url: string;
    lrcInfo: any;
    dt: number;
    st: number;
  };
  player: {
    ref: React.RefObject<HTMLAudioElement> | null;
  };
  currentLyric: [number, string];
  currentLyricPosition: { x: string; y: string };
  currentTime: number;
}

export const initState: init = {
  songList: [],
  isPlaying: false,
  currentSong: {
    index: 0,
    id: 0,
    name: "",
    ar: [],
    al: {
      picUrl: "",
      name: "",
    },
    url: "",
    lrcInfo: "",
    dt: 0, // 总时长，ms
    st: 0, // 是否喜欢
  },
  player: {
    ref: null,
  },
  currentLyric: [0, ""],
  currentLyricPosition: { y: "1rem", x: "50%" },
  currentTime: 0,
};
