import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { reqGetSingerDesc } from "../../../request";
import "./index.less";
const Detail = () => {
  const [desc, setDesc] = useState<{
    briefDesc: string;
    introduction: any[];
    topicData: any[];
  }>({ briefDesc: "", introduction: [], topicData: [] });
  const location = useLocation();
  const checkValid = useCallback(() => {
    if (!!location.state || !!sessionStorage.getItem("singerDetail")) {
      return location.state || sessionStorage.getItem("singerDetail");
    }
    return null;
  }, [location.state]);
  useEffect(() => {
    const getDesc = async () => {
      const id = checkValid();
      if (id) {
        const res = ((await reqGetSingerDesc(id as string)) as unknown) as {
          briefDesc: string;
          introduction: any[];
          topicData: any[];
        };
        console.log(res);
        setDesc(res);
      }
    };
    getDesc();
  }, [checkValid]);

  const mapIntroduction = () => {
    return desc.introduction.map((item, index) => {
      const formatTxt = (txt: string) => {
        const help = txt.split("\n");
        return help.map((item, index) => {
          return <div key={index}>{item}</div>;
        });
      };
      return (
        <div className="detail_intro_item" key={index}>
          <div className="detail_intro_item_title">{item.ti}</div>
          <div className="detail_intro_item_txt">{formatTxt(item.txt)}</div>
        </div>
      );
    });
  };

  return (
    <div className="detail">
      <h2 className="detail_title">简介</h2>
      <p className="detail_desc">{desc.briefDesc}</p>
      <div className="detail_intro">{mapIntroduction()}</div>
    </div>
  );
};

export default Detail;
