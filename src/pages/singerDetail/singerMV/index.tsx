import React, { useCallback, useEffect, useState, FC } from "react";
import "./index.less";
import { reqGetSingerMv } from "../../../request/index";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { CaretRightOutlined } from "@ant-design/icons";
import classNames from "classnames";

type IProps = {
  isScroll?: boolean;
};
const SingerMv: FC<IProps> = ({ isScroll = false }) => {
  const [mv, setMv] = useState<any[]>([]);
  const nav = useNavigate();
  useEffect(() => {
    const getMv = async () => {
      if (!sessionStorage.getItem("singerDetail")) {
        nav("/");
      }
      const res = await reqGetSingerMv(
        sessionStorage.getItem("singerDetail") as string
      );
      console.log(res);
      setMv(res.mvs);
    };
    getMv();
  }, [nav]);

  const ToMvDetail = useCallback(
    (id: string) => {
      nav("/mvDetail", { state: id });
    },
    [nav]
  );
  const mapMv = useCallback(() => {
    return mv.map((item) => {
      return (
        <div
          onClick={() => ToMvDetail(item.id)}
          className="mv_item"
          key={item.id}
        >
          <div className="item_up">
            <img className="mv_img" src={item.imgurl} alt="" />
            <div className="mv_time">
              {dayjs(item.duration).format("mm:ss")}
            </div>
            <div className="mv_playCount">
              <CaretRightOutlined />
              {item.playCount < 10000
                ? item.playCount
                : `${Math.floor(item.playCount / 10000)}万`}{" "}
            </div>
          </div>
          <div>{item.name}</div>
        </div>
      );
    });
  }, [ToMvDetail, mv]);

  return (
    <div
      className={classNames({
        singerMv: true,
        scroll: isScroll,
      })}
    >
      {mapMv()}
    </div>
  );
};

export default SingerMv;
