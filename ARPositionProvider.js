import React, { createContext, useState, useRef, useEffect } from "react";
import {
  subscribeToARPositionChange,
  setPOVSensitivity,
  setPOVOrientationSensitivity
} from "./RNSwiftBridge";
const context = createContext({
  position: { x: 0, y: 0, z: 0 },
  orientation: {}
});
const { Provider, Consumer: ARPositionConsumer } = context;
import consumerIf from "consumerif";
const ARPositionProvider = ({
  positionSensitivity = 0.1,
  orientationSensitivity = 0.05,
  onPositionChange,
  children
}) => {
  const [providerValue, setProviderValue] = useState({
    position: { x: 0, y: 0, z: 0 },
    orientation: { x: 0 }
  });
  const positionChange = useRef(null);
  useEffect(() => {
    positionChange.current = subscribeToARPositionChange(data => {
      setProviderValue(data);
      if (onPositionChange) onPositionChange(data);
    });
    () => positionChange.current && positionChange.current.remove();
  }, []);
  useEffect(() => {
    setPOVSensitivity(positionSensitivity);
  }, [positionSensitivity]);
  useEffect(() => {
    setPOVOrientationSensitivity(orientationSensitivity);
  }, [orientationSensitivity]);
  return (
    <Provider value={providerValue}>
      {consumerIf(children, ARPositionConsumer)}
    </Provider>
  );
};
export { ARPositionProvider, ARPositionConsumer, context as ARPositionContext };
export default ARPositionProvider;
