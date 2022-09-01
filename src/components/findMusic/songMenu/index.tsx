import {
  AppstoreOutlined,
  BookOutlined,
  CoffeeOutlined,
  GlobalOutlined,
  RightOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Popover, Space, Tag } from "antd";
import CheckableTag from "antd/lib/tag/CheckableTag";
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { reqGetPlayListCatlist } from "../../../request";
import "./index.less";
import SongMenusContent from "./songMenusContent";
export default function SongMenus() {
  const [category, setCategory] = useState<{ [key: string]: string }>({});
  const [sub, setSub] = useState<any[]>([]);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getPlatList = async () => {
      const res = await reqGetPlayListCatlist();
      console.log(res);
      setCategory(res.categories);
      setSub(res.sub);
    };
    getPlatList();
  }, []);

  const [selectedTags, setSelectedTags] = useState<string>("华语");

  const handleChange = useCallback(
    (tag: any, checked: boolean) => {
      console.log("tag");
      if (tag === selectedTags) return;
      setSelectedTags(tag.name);
    },
    [selectedTags]
  );

  const mapTag = () => {
    const img = [
      <GlobalOutlined />,
      <BookOutlined />,
      <CoffeeOutlined />,
      <SmileOutlined />,
      <AppstoreOutlined />,
    ];
    let arr: string[] = [];
    Object.keys(category).map((item) => (arr[parseInt(item)] = category[item]));
    return arr.map((item, index) => {
      const help = sub.filter((item2) => item2.category === index);
      const right = () => {
        return help.map((item3: any, index) => {
          return (
            <div
              key={index}
              className={classNames({
                tag_item_right_name: true,
                selectItem: item3.name === selectedTags,
              })}
            >
              {item3.name}
            </div>
          );
        });
      };

      return (
        <div className="tag_item">
          <div className="tag_item_left">
            <Space>{img[index]}</Space> <span> {item}</span>
          </div>
          <div className="tag_item_right">{right()}</div>
        </div>
      );
    });
  };

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

  const mapSub = useCallback(() => {
    const res = sub.slice(0, 10);
    return res.map((tag) => {
      return (
        <CheckableTag
          key={tag.name}
          checked={tag.name === selectedTags}
          onChange={(checked) => handleChange(tag, checked)}
        >
          {tag.name}
        </CheckableTag>
      );
    });
  }, [handleChange, selectedTags, sub]);

  return (
    <div className="songMenus">
      <div className="songMenus_Header">
        <div>
          <Popover
            visible={visible}
            placement="bottom"
            content={mapTag()}
            title="全部歌单"
            trigger="click"
            onVisibleChange={handleVisibleChange}
          >
            <Button onClick={() => setVisible(true)} shape="round">
              {selectedTags} <RightOutlined />
            </Button>
          </Popover>
        </div>

        <div>{mapSub()}</div>
      </div>
      <SongMenusContent tag={selectedTags} />
    </div>
  );
}
