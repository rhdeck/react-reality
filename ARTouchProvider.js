import React, { Component, createContext } from "react";
import { doTap } from "./RNSwiftBridge";
import consumerIf from "consumerif";
const context = createContext({});
const { Provider, Consumer: ARTouchConsumer } = context;
const ARTouchProvider = () => {
  const registeredNodes = useRef({});
  const providerValue = useRef({
    registerNode: (id, node) => (registeredNodes.current[id] = node),
    removeNode: id => delete registeredNodes.current[id],
    triggerAtLocation: async (prop, x, y) => {
      const { nodes = [] } = await doTap(x, y);
      nodes.reduce((o, id) => {
        if (o) return;
        const node = registeredNodes.current[id];
        if (
          node &&
          node.props &&
          node.props[prop] &&
          typeof node.props[prop] === "function"
        ) {
          node.props[propName]();
          o = true;
        }
      });
    }
  });
  return (
    <Provider value={providerValue.current}>
      {consumerIf(children, ARTouchConsumer)}
    </Provider>
  );
};
export { ARTouchProvider, ARTouchConsumer };
export default ARTouchProvider;
