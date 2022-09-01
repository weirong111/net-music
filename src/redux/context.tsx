import { useReducer } from "react";
import reducer from "./reducer";
import Context from "./store";
import { initState } from "./initState";
const ContextProvider = (props: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
