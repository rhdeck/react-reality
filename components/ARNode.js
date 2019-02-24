import React, { createContext, useContext, useState, useEffect } from "react";
import { ARSessionContext } from "../ARSessionProvider";
import { ARAnimatedContext } from "../ARAnimatedProvider";
import { ARTouchContext } from "../ARTouchProvider";
import UUID from "uuid/v4";
import { addNode, removeNode, updateNode } from "../RNSwiftBridge";
import { useUpdateState } from "../utils";
const ARNodeContext = createContext({});
const { Provider, Consumer: ARNodeConsumer } = ARNodeContext;
//#region ARNode
const ARNode = ({ id, children, removeNode: onUnmount, ...nodeProps }) => {
  const { isStarted } = useContext(ARSessionContext);
  const { registerNode, removeNode: touchOnUnmount } = useContext(
    ARTouchContext
  );
  const { nodeID: parentNode = "" } = useContext(ARNodeContext);
  const { willNativeUpdate, didNativeUpdate } = useContext(ARAnimatedContext);
  const [isMounted, setIsMounted] = useState(false);
  const nodeID = useRef(id);
  if (!nodeID.current) nodeID.current = UUID();
  useEffect(() => {
    if (registerNode) registerNode(nodeID.current);
    return () => {
      removeNode(nodeID.current);
      if (onUnmount) onUnmount(nodeID.current);
      if (touchOnUnmount) touchOnUnmount(nodeID.current);
    };
  }, []);
  const [triggerUpdate] = useUpdateState(async () => {
    if (!isStarted) throw "not started";
    if (willNativeUpdate) await willNativeUpdate();
    if (isMounted) {
      await addNode({ ...nodeProps, id: nodeID.current }, parentNode);
      setIsMounted(true);
    } else await updateNode(nodeID.current, nodeProps);
    if (didNativeUpdate) await didNativeUpdate();
  });
  useEffect(() => {
    triggerUpdate();
  }, nodeProps);
  const providerValue = useRef({ nodeID: nodeID.current });
  return (
    <Provider value={providerValue.current}>
      {consumerif(children, ARNodeConsumer)}
    </Provider>
  );
};
//#endregion
export { ARNode, ARNodeConsumer, ARNodeContext };
export default ARNode;
