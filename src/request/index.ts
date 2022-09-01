import ajax from "./ajax";

export const reqGetcaptcha = (phone: string) =>
  ajax<boolean>("/captcha/sent", { phone });

export const reqLogin = (phone: string, captcha: string) =>
  ajax("/login/cellphone", { phone, captcha }, "POST");

export const reqGetkey = () =>
  ajax<{
    code: number;
    unikey: string;
  }>("/login/qr/key", {}, "POST");

export const reqGetCode = (key: string, qrimg: string = "") =>
  ajax<{
    qrurl: string;
    qrimg: string;
  }>("/login/qr/create", { key, qrimg }, "POST");

export const reqCodeCheck = (key: string) =>
  ajax<{}>("/login/qr/check", { key }, "POST");

export const reqGetrecommend = (limit = 32) => ajax("/personalized", { limit });

export const reqGetMenuAll = (id: string, offset: number = 0) =>
  ajax("/playlist/track/all", { id, offset });

export const reqGetMenuHeader = (id: string) =>
  ajax("/playlist/detail", { id });

export const reqGetMp3 = (id: string) => ajax<any[]>("/song/url", { id });

export const reqCheckMusic = (id: string) => ajax<any>("/check/music", { id });

export const reqGetLyric = (id: string) => ajax<any>("/lyric", { id });

export const reqGetSimpplayList = (id: string) =>
  ajax<any>("/simi/playlist", { id });

export const reqGetComments = (id: string, offset: number) =>
  ajax<any>("/comment/music", { id, offset, limit: 20 });

export const reqGetHotComments = (id: string, offset: number = 1) =>
  ajax<any>("/comment/hot", { id, type: 0, offset, limit: 20 });

export const reqGetDefaultSearch = () => ajax<any>("/search/default");

export const reqHotSearch = () => ajax<any>("/search/hot/detail");

export const reqSearchSuggest = (keywords: string) =>
  ajax<any>("/search/suggest", { keywords });

export const reqSearchResult = (
  keywords: string,
  type: number = 1,
  limit = 10,
  offset = 1
) => ajax<any>("/cloudsearch", { keywords, type, limit, offset });

export const reqSingerDetail = (id: string) =>
  ajax<any>("/artist/detail", { id });

export const reqSingerTopSong = (id: string) =>
  ajax<any>("/artist/top/song", { id });

export const reqGetAlbumDetail = (id: number) => ajax<any>("/album", { id });

export const reqGetSingerAlbum = (id: string, limit = 20, offset = 1) =>
  ajax<any>("/artist/album", { id, limit, offset });

export const reqGetSingerMv = (id: string) => ajax<any>("/artist/mv", { id });

export const reqGetDetailMv = (id: string) => ajax("/mv/url", { id });

export const reqGetSimiMv = (mvid: string) => ajax("/simi/mv", { mvid });

export const reqGetMvDetail = (mvid: string) => ajax("/mv/detail", { mvid });

export const reqGetMvComment = (id: string, limit = 20, offset = 1) =>
  ajax("/comment/mv", { id, limit, offset });

//给资源点赞
export const reqlikeResource = (id: string, t: number = 1, type = 1) =>
  ajax("/resource/like", { id, t, type });

export const reqGetmyLikeList = () => ajax("/playlist/mylike");

export const reqGetSingerDesc = (id: string) => ajax("/artist/desc", { id });

export const reqGetSimiSinger = (id: string) => ajax("/simi/artist", { id });

export const reqGetSingerVideo = (
  id: string,
  cursor = 0,
  limit = 10,
  order = 0
) => ajax("/artist/video", { id, cursor, limit, order });

export const reqGetRecentSong = (limit = 100) =>
  ajax("/record/recent/song", { limit });

export const reqGetCollectAlbums = (limit = 25, offset = 0) =>
  ajax("/album/sublist", { limit, offset });

export const reqAlbumSub = (id: string, t = 1) => ajax("/album/sub", { id, t });

export const reqArtistSublist = () => ajax<any[]>("/artist/sublist");

export const reqGetMvSubList = () => ajax<any[]>("/mv/sublist");

export const reqGetPlayListCatlist = () => ajax<any[]>("/playlist/catlist");

export const reqGetTopPlayList = (
  order: string = "hot",
  cat: string = "华语",
  limit = 50,
  offset = 0
) => ajax<any[]>("/top/playlist", { order, cat, limit, offset });

export const reqGetToplist = () => ajax("/toplist");

export const reqGetTopArtists = (limit = 50, offset = 0) =>
  ajax("/top/artists", { limit, offset });

export const reqGetArtistlist = (
  limit = 20,
  offset = 0,
  type = -1,
  area = -1,
  initial: string | number = -1
) => ajax("/artist/list", { limit, offset, type, area, initial });

export const reqGetUserPlaylist = (uid: any, limit = 30, offset = 0) =>
  ajax("/user/playlist", { uid, limit, offset });

export const reqGetUserAccount = () => ajax("/user/account");

export const reqGetLoginStatus = () => ajax<any>("/login/status");

export const reqGetLogout = () => ajax<any>("/logout");

//获取视频标签列表
export const reqGetVideoList = () => ajax<any>("/video/group/list");
//获取视频分类列表
export const reqGetVideoCategory = () => ajax<any>("/video/category/list");

//获取视频标签/分类下的视频
export const reqGetVideoGroup = (id: string, offset = 0) =>
  ajax<any>("/video/group", { id, offset });

//获取全部视频列表
export const reqGetVideoAll = (offset = 0) =>
  ajax<any>("/video/timeline/all", { offset });

//获取视频的url
export const reqGetVideoUrl = (id: string) => ajax("/video/url", { id });
//获取视频详情
export const reqGetVideoDetail = (id: string) =>
  ajax<any>("/video/detail", { id });
//获取视频点赞转发评论数
export const reqGetVideoInfo = (id: string) =>
  ajax<any>("/video/detail/info", { vid: id });
//获取相关视频
export const reqGetRelatedVideo = (id: string) =>
  ajax<any>("/related/allvideo", { id });

export const reqGetVideoComment = (id: string, limit = 20, offset = 0) =>
  ajax<any>("/comment/video", { id, limit, offset });
//获取全部MV
export const reqGetMvAll = (
  area: string,
  type: string,
  order: string,
  limit = 30,
  offset = 0
) => ajax<any>("/mv/all", { area, type, order, limit, offset });
