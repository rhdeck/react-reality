import React, { createContext, useState, useEffect } from "react";
import { clear, pause, resume, setWorldTracking } from "./RNSwiftBridge";
import consumerIf from "consumerif";
const context = createContext({});
const { Provider, Consumer: ARSessionConsumer } = context;
const ARSessionProvider = ({ alignment = "gravity", children }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [providerValue, setProviderValue] = useState();
  useEffect(() => {
    const start = async () => {
      try {
        await resume();
      } catch (e) {}
      try {
        await clear();
      } catch (e) {}
      setIsStarted(true);
    };
    const stop = () => pause();
    setProviderValue({ isStarted, start, stop });
  }, [isStarted, alignment]);
  useEffect(() => {
    setWorldTracking(alignment);
  }, [alignment]);
  return (
    <Provider value={providerValue}>
      {consumerIf(children, ARSessionConsumer)}
    </Provider>
  );
};
export { ARSessionProvider, ARSessionConsumer, context as ARSessionContext };
export default ARSessionProvider;
