import Search from "../components/search";
import React, { lazy, Suspense } from "react";
import { Spin } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SongMenus from "../components/findMusic/songMenu";
import FindMusic from "../components/findMusic";
import Recommend from "../components/findMusic/recommend";
import MainContent from "../components/mainContent";
import SongList from "../components/songList";
import Error from "../pages/Error";
import Home from "../pages/home";
import Index from "../pages/home/content";
import Login from "../pages/login";
import SongDetail from "../pages/songDetail";
import SimpleSong from "../components/simpleSong";
import SearchSinger from "../components/searchSinger";
import SingerDetail from "../pages/singerDetail";
import SingerDetailIndex from "../pages/singerDetail/singerDetailIndex";
import SingerMv from "../pages/singerDetail/singerMV";
import MvDetail from "../pages/MvDetail";
import Detail from "../pages/singerDetail/detail";
import MyCreateSongList from "../components/myCreateSongList";
const SimiSinger = lazy(() => import("../pages/singerDetail/simiSinger"));
const Zhuangji = lazy(() => import("../components/search/album"));
const AlbumList = lazy(() => import("../components/albumList"));
const VideoList = lazy(() => import("../components/videoList"));
const RecentSong = lazy(() => import("../components/recentSong"));
const MyCollection = lazy(() => import("../components/myCollection"));
const MyAlbum = lazy(() => import("../components/myCollection/myAlbum"));
const MycollectionSinger = lazy(() =>
  import("../components/myCollection/myCollectionSinger")
);
const MyVideo = lazy(() =>
  import("../components/myCollection/myCollectionSinger")
);
const RangingList = lazy(() => import("../components/findMusic/RankingList"));
const Singer = lazy(() => import("../components/findMusic/singer"));

const VideoMenu = lazy(() => import("../components/videoMenu"));
const VideoItemOne = lazy(() => import("../components/videoMenu/videoItemOne"));
const VideoDetail = lazy(() => import("../pages/videoDetail"));
const MvItem = lazy(() => import("../components/videoMenu/MvItem"));

const lazyRoute = (Com: React.FC) => {
  return (
    <Suspense fallback={<Spin />}>
      <Com />
    </Suspense>
  );
};

export default function BaseRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route element={<Index />}>
            <Route element={<MainContent />}>
              <Route path="singerDetail" element={<SingerDetail />}>
                <Route index element={<SingerDetailIndex />}></Route>
                <Route path="MV" element={lazyRoute(SingerMv)} />
                <Route path="detail" element={lazyRoute(Detail)} />
                <Route path="simple" element={lazyRoute(SimiSinger)} />
              </Route>
              <Route path="search" element={lazyRoute(Search)}>
                <Route index element={lazyRoute(SimpleSong)} />
                <Route path="singer" element={lazyRoute(SearchSinger)} />
                <Route path="zhuangji" element={lazyRoute(Zhuangji)} />
                <Route path="video" element={lazyRoute(VideoList)} />
              </Route>
              <Route path="mymusic">
                <Route index element={lazyRoute(RecentSong)} />
                <Route path="collection" element={lazyRoute(MyCollection)}>
                  <Route index element={lazyRoute(MyAlbum)} />
                  <Route
                    path="singer"
                    element={lazyRoute(MycollectionSinger)}
                  />
                  <Route path="video" element={lazyRoute(MyVideo)} />
                </Route>
              </Route>

              <Route element={<FindMusic />}>
                <Route index element={<Recommend />} />
                <Route path="songMenus" element={lazyRoute(SongMenus)} />
                <Route path="rankingList" element={lazyRoute(RangingList)} />
                <Route path="singer" element={lazyRoute(Singer)} />
              </Route>

              <Route path="songList" element={lazyRoute(SongList)}></Route>
              <Route path="albumList" element={lazyRoute(AlbumList)} />
              <Route path="videoMenu" element={lazyRoute(VideoMenu)}>
                <Route index element={lazyRoute(VideoItemOne)} />
                <Route
                  path="MV"
                  element={
                    <Suspense fallback={<Spin />}>
                      <MvItem />
                    </Suspense>
                  }
                ></Route>
              </Route>
              <Route path=":id" element={<MyCreateSongList />} />
            </Route>
            <Route path="detail" element={lazyRoute(SongDetail)} />
            <Route path="mvDetail" element={lazyRoute(MvDetail)} />
            <Route path="videoDetail" element={lazyRoute(VideoDetail)} />
          </Route>
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}
