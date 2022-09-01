import "./index.less";
import logo from "../../assets/logo.png";
import { Input, Button, Dropdown, Space, Menu } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Login from "./login";
import { reqGetDefaultSearch, reqHotSearch } from "../../request";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
const { Search } = Input;
function Headers() {
  const nav = useNavigate();
  const [defaultSearct, setDefaultSearct] = useState("");
  const [hotSearch, setHotSarch] = useState<
    {
      searchWord: string;
      score: number;
      content: string;
      iconUrl: string;
    }[]
  >([]);

  const getSearchResult = (item: any) => {
    console.log(item);
    sessionStorage.setItem("search", item.key);
    nav("/search", { state: item.key });
  };

  useEffect(() => {
    const getDefault = async () => {
      const res1 = await reqGetDefaultSearch();
      setDefaultSearct(res1.data.realkeyword);
      const res2 = await reqHotSearch();
      console.log(res2);
      setHotSarch(res2.data);
    };
    getDefault();
  }, []);

  const formatSearch = () => {
    return hotSearch.map((item, index) => {
      return {
        label: (
          <div className="menuItem">
            <div
              className={classNames({
                menuItem_index: true,
                menuItem_pre: index < 3,
              })}
            >
              {index + 1}
            </div>
            <div className="menuItem_content">
              <div>
                <span
                  className={classNames({
                    menuItem_pre_span: index < 3,
                  })}
                >
                  {item.searchWord}
                </span>
                <span> {item.score}</span>
              </div>
              <div className="menuItem_desc">{item.content}</div>
            </div>
          </div>
        ),
        key: item.searchWord,
      };
    });
  };

  const onSearch = (val: string) => {
    sessionStorage.setItem("search", val);
    nav("search", { state: val });
  };
  return (
    <div className="headers">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="headers_jiantou">
        <Button
          type="primary"
          shape="circle"
          onClick={() => window.history.back()}
        >
          <LeftOutlined />
        </Button>
        <Button
          type="primary"
          shape="circle"
          onClick={() => window.history.go()}
        >
          <RightOutlined />
        </Button>
      </div>
      <div className="headers_search">
        <Dropdown
          overlay={
            <Menu
              style={{
                height: 400,
                overflowX: "hidden",
                textOverflow: "ellipsis",
                overflowY: "scroll",
                width: 300,
              }}
              onClick={getSearchResult}
              items={formatSearch()}
            />
          }
          trigger={["click"]}
        >
          <div>
            <Search onSearch={onSearch} placeholder={defaultSearct} />
          </div>
        </Dropdown>
      </div>
      <Login />
    </div>
  );
}

export default Headers;
