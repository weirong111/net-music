import React, { useCallback, useState } from "react";
import { Divider, Space, Tag } from "antd";
import "./index.less";
import MvitemContent from "./MvitemContent";
const { CheckableTag } = Tag;
const area = ["全部", "内地", "港台", "欧美", "日本", "韩国"];
const order = ["上升最快", "最热", "最新"];
const type = ["全部", "官方版", "原生", "现场版", "网易出品"];
export default function MvItem() {
  const [selectOrder, setOrder] = useState("上升最快");
  const [selectArea, setArea] = useState("全部");
  const [selectType, setSelectType] = useState("全部");
  const changeArea = useCallback(
    (item: string) => {
      if (selectArea === item) return;
      setArea(item);
    },
    [selectArea]
  );
  const changeType = useCallback(
    (item: string) => {
      if (selectType === item) return;
      setSelectType(item);
    },
    [selectType]
  );
  const changeOrder = useCallback(
    (item: string) => {
      if (selectOrder === item) return;
      setOrder(item);
    },
    [selectOrder]
  );
  const mapArea = useCallback(() => {
    return area.map((item) => {
      return (
        <span>
          <CheckableTag
            key={item}
            onClick={() => changeArea(item)}
            checked={item === selectArea}
          >
            {item}
          </CheckableTag>
          <Divider type="vertical" />
        </span>
      );
    });
  }, [changeArea, selectArea]);
  const mapType = useCallback(() => {
    return type.map((item) => {
      return (
        <span>
          <CheckableTag
            key={item}
            onClick={() => changeType(item)}
            checked={item === selectType}
          >
            {item}
          </CheckableTag>
          <Divider type="vertical" />
        </span>
      );
    });
  }, [changeType, selectType]);
  const mapOrder = useCallback(() => {
    return order.map((item) => {
      return (
        <span>
          <CheckableTag
            key={item}
            onClick={() => changeOrder(item)}
            checked={item === selectOrder}
          >
            {item}
          </CheckableTag>
          <Divider type="vertical" />
        </span>
      );
    });
  }, [changeOrder, selectOrder]);

  return (
    <div className="MvItem">
      <div className="tagItem">
        <Space>
          <span>地区:</span> <span>{mapArea()}</span>{" "}
        </Space>
      </div>
      <div className="tagItem">
        <Space>
          <span>类型:</span> <span>{mapType()}</span>{" "}
        </Space>
      </div>
      <div className="tagItem">
        <Space>
          <span>排序:</span> <span>{mapOrder()}</span>{" "}
        </Space>
      </div>
      <MvitemContent area={selectArea} type={selectType} order={selectOrder} />
    </div>
  );
}
