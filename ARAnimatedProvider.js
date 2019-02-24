import React, { createContext, useState, useEffect } from "react";
import { setAnimation } from "./RNSwiftBridge";
const context = createContext({});
const { Provider, Consumer } = context;
const ARAnimatedProvider = ({
  milliseconds = 250,
  easing = "inout",
  children
}) => {
  const [providerValue, setProviderValue] = useState();
  useEffect(() => {
    const willNativeUpdate = () =>
      setAnimation(parseFloat(milliseconds) / 1000.0, easing);
    const didNativeUpdate = () => {};
    setProviderValue({
      willNativeUpdate,
      didNativeUpdate
    });
  }, [milliseconds, easing]);
  return <Provider value={providerValue}>{children}</Provider>;
};
export {
  ARAnimatedProvider,
  Consumer as ARAnimatedConsumer,
  context as ARAnimatedContext
};
export default ARAnimatedProvider;
