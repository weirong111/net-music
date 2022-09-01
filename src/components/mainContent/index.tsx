import React from "react";
import { Outlet } from "react-router-dom";
import Menus from "../menu";
import "./index.less";
export default function MainContent() {
  return (
    <div className="home_content">
      <Menus />
      <Outlet />
    </div>
  );
}
