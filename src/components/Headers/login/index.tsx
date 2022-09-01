import React, { useState, useRef, useEffect } from "react";
import {
  ClockCircleOutlined,
  LeftOutlined,
  PhoneOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Space, Modal, Input, Button, Avatar, message, Spin } from "antd";

import {
  reqGetcaptcha,
  reqLogin,
  reqGetkey,
  reqGetCode,
  reqCodeCheck,
  reqGetLoginStatus,
  reqGetLogout,
} from "../../../request/index";
import "./index.less";
export default function Login() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<{ [key: string]: any } | null>(null);
  const Inputref = useRef<any>(null);
  const [isBidden, setBidden] = useState(false);
  const captchaRef = useRef<any>(null);
  const [count, setCount] = useState(60);
  const [codeVisible, setCodeVisible] = useState(false);
  const [codeImg, setCodeImg] = useState("");
  const showModal = () => {
    setVisible(true);
  };

  const getCaptcha = async () => {
    if (Inputref.current) {
      const phone = Inputref.current.input.value;
      const res = await reqGetcaptcha(phone);
      if (res.code === 200 && res.data) {
        message.success("您已经成功获取验证码");
        setBidden(true);
        const id = setInterval(() => {
          setCount((count) => {
            if (count === 0) {
              clearInterval(id);
              setBidden(false);
              return 60;
            } else return --count;
          });
        }, 1000);
      } else message.error("验证码发送出现错误");
    }
  };
  const handleOk = async () => {
    const phone = Inputref.current.input.value;
    const captcha = captchaRef.current.input.value;
    const res = await reqLogin(phone, captcha);
    console.log(res);
    setVisible(false);
  };
  const codeLogin = async () => {
    setCodeVisible(true);
    const key = await reqGetkey();

    const res = await reqGetCode(key.data.unikey, " ");

    setCodeImg(res.data.qrimg);
    const id = setInterval(async () => {
      const check = await reqCodeCheck(key.data.unikey);

      if (check.code === 803) {
        console.log(check);
        message.success(check.message);
        document.cookie += check.cookie;
        setCodeVisible(false);
        clearInterval(id);
      } else if (check.code === 800) {
        message.warn(check.message + "请刷新页面");
        clearInterval(id);
      }
    }, 1000);
  };

  const handleCancel = () => {
    setCodeVisible(false);
  };

  const handleCancel2 = () => {
    setCodeVisible(false);
  };

  useEffect(() => {
    const getStatus = async () => {
      const res = await reqGetLoginStatus();
      console.log(res);
      setStatus(res.data.profile);
    };
    getStatus();
  }, []);

  const loginOut = async () => {
    setStatus(null);
    const res = await reqGetLogout();
    console.log(res);
  };

  return status ? (
    <div className="status_login">
      <Space>
        <img src={status.avatarUrl} alt="" />
        <span>{status.nickname}</span>
        <Button style={{ color: "lightBlue" }} type="link" onClick={loginOut}>
          退出登录
        </Button>
      </Space>
    </div>
  ) : (
    <div className="heads_avatar">
      <Space>
        <Avatar size={32} icon={<UserOutlined />} />
        <Space>
          <span onClick={showModal}> 手机号码登录</span> /
          <span onClick={codeLogin}>二维码登录</span>
        </Space>
      </Space>
      <Modal
        title="二维码登录"
        visible={codeVisible}
        onOk={() => setCodeVisible(false)}
        onCancel={() => handleCancel2}
        okText="登录"
      >
        {codeImg === "" ? (
          <Spin tip="Loading..." />
        ) : (
          <img src={codeImg} alt="" />
        )}
      </Modal>

      <Modal
        title="手机号登录"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="登录"
      >
        <div className="modal_login">
          <Input
            style={{ marginBottom: 30 }}
            prefix={<PhoneOutlined />}
            ref={Inputref}
            placeholder="请输入手机号码"
          />
          <Input.Group compact>
            <Input
              ref={captchaRef}
              placeholder="输入验证码"
              style={{ width: "calc(100% - 120px)" }}
            />
            <Button disabled={isBidden} type="primary" onClick={getCaptcha}>
              {isBidden ? count : "获取验证码"}
            </Button>
          </Input.Group>
        </div>
      </Modal>
    </div>
  );
}
