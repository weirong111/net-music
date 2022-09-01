import { RightOutlined } from "@ant-design/icons";
import { Button, Divider, Popover, Space, Tag } from "antd";
import React, { FC, useCallback, useState } from "react";
import "./index.less";

type Iprops = {
  category: any[];
  list: any[];
  select: string;
  setCategory: React.Dispatch<React.SetStateAction<any[]>>;
  setList: React.Dispatch<React.SetStateAction<any[]>>;
  setSelect: React.Dispatch<React.SetStateAction<string>>;
};
const { CheckableTag } = Tag;
const VideoItemOneHeader: FC<Iprops> = ({
  category,
  list,
  setCategory,
  setList,
  select,
  setSelect,
}) => {
  const [visible, setVisible] = useState(false);

  const handleChange = useCallback(
    (tag: any, checked: boolean) => {
      if (select === tag.id) return;
      setSelect(tag.id);
    },
    [select, setSelect]
  );
  const mapCategory = useCallback(() => {
    return category.map((tag) => {
      return (
        <CheckableTag
          key={tag.id}
          checked={tag.id === select}
          onChange={(checked) => handleChange(tag, checked)}
        >
          {tag.name}
        </CheckableTag>
      );
    });
  }, [category, handleChange, select]);

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };
  const changeList = useCallback(
    (id: string) => {
      if (id === select) return;
      setSelect(id);
      setVisible(false);
    },
    [select, setSelect]
  );
  const content = useCallback(() => {
    const mapList = () => {
      return list.map((item) => {
        return (
          <CheckableTag
            className="checkedTag"
            onClick={() => changeList(item.id)}
            checked={item.id === select}
            key={item.id}
          >
            {item.name}
          </CheckableTag>
        );
      });
    };
    return (
      <div className="videoItemOneHeader_content">
        <div className="videoItemOneHeader_title">
          {
            <CheckableTag
              onClick={() => changeList("全部视频")}
              key={"全部视频"}
              checked={"全部视频" === select}
            >
              全部视频
            </CheckableTag>
          }
        </div>
        <Divider />
        <div className="videoItemOneHeader_mapList">{mapList()}</div>
      </div>
    );
  }, [changeList, list, select]);

  const getName = useCallback(
    (id: string) => {
      if (id === "全部视频") {
        return "全部视频";
      } else {
        let sth = list.find((item) => item.id === id);
        return sth.name;
      }
    },
    [list]
  );
  return (
    <div className="videoItemOneHeader">
      <Popover
        trigger="click"
        onVisibleChange={handleVisibleChange}
        content={content()}
        placement={"bottom"}
        visible={visible}
      >
        <Button shape="round">
          {getName(select)} <RightOutlined />
        </Button>
      </Popover>

      <div>
        <Space>{mapCategory()}</Space>
      </div>
    </div>
  );
};

export default VideoItemOneHeader;
