import React, { createContext, useState } from "react";
import { ARPositionContext } from "../ARPositionProvider";
import { ARNodeContext } from "./ARNode";
import { ARSessionContext } from "../ARSessionProvider";
import { projectNode } from "../RNSwiftBridge";
import {} from "../utils";
import consumerIf from "consumerif";
const ARProjectedPointContext = createContext({
  position: {},
  orientation: {}
});
const { Provider, Consumer } = ARProjectedPointContext;
const ARProjectedPointProvider = ({ children, ...props }) => {
  const { isStarted } = useContext(ARSessionContext);
  const { position } = useContext(ARPositionContext);
  const { nodeID } = useContext(ARNodeContext);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [providerValue, setProviderValue] = useState({ x, y, z });
  useEffect(() => {
    (async () => {
      if (!isStarted) return;
      const { x, y, z } = await projectNode(nodeID);
      setX(parseInt(x));
      setY(parseInt(y));
      setZ(parseInt(z));
    })();
  }, [position]);
  useEffect(() => {
    if (z > 1) {
      if (typeof providerValue.position.x !== "undefined")
        setProviderValue({ position: {} });
    } else {
      setProviderValue({ position: { x, y, z } });
    }
  }, [x, y, z]);
  return (
    <Provider value={providerValue}>{consumerIf(children, Consumer)}</Provider>
  );
};
export default ARProjectedPointProvider;
export {
  ARProjectedPointProvider,
  Consumer as ARProjectedPointConsumer,
  ARProjectedPointContext
};
