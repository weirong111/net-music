import { Space, Tag } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SingerMv from "../../pages/singerDetail/singerMV";
import { reqGetSingerVideo } from "../../request";

const VideoList = () => {
  const location = useLocation();
  const checkValid = useCallback(() => {
    const id = sessionStorage.getItem("singerDetail") || location.state;
    return id ? id : null;
  }, [location.state]);
  const [video, setVideo] = useState<any[]>([]);
  useEffect(() => {
    const getVideo = async () => {
      const id = checkValid() as string;
      if (id) {
        const res = await reqGetSingerVideo(id, 0);
        console.log(res);
        setVideo((res.data as any).records);
      }
    };
    getVideo();
  }, [checkValid]);

  return (
    <div>
      <SingerMv isScroll={true} />
    </div>
  );
};

export default VideoList;
