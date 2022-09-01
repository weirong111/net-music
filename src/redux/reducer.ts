type action = {
  type: string;
  action: string;
  data: any;
};
interface init {
  songList: any[];
  [key: string]: any;
}
export default function reducer(state: any, action: action): init {
  switch (action.action) {
    case "SONG":
      switch (action.type) {
        case "SETSONGLIST":
          console.log(action);
          return { ...state, songList: action.data };
        case "SETCURRENTSONG":
          return { ...state, currentSong: action.data };
        case "SETISPLAYING":
          return { ...state, isPlaying: action.data };
        case "SETPLAYER":
          return { ...state, player: { ref: action.data } };
        case "SETLYRIC":
          return { ...state, currentLyric: action.data };
        case "SERLYRIC":
          return { ...state, currentLyricPosition: action.data };
        case "SETCURRENTTIME": {
          return { ...state, currentTime: action.data };
        }
        default:
          return state;
      }
    default:
      return state;
  }
}
