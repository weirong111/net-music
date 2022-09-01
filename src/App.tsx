import React from "react";
import ContextProvider from "./redux/context";
import BaseRouter from "./router";
import "antd/dist/antd.less";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <ContextProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <BaseRouter />
        </div>
      </DndProvider>
    </ContextProvider>
  );
}

export default App;
