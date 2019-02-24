import React, { useRef, useContext, useState } from "react";
import {
  removeSKNode,
  setSKVideoNode,
  updateSKVideoNode
} from "../RNSwiftBridge";
import UUID from "uuid/v4";
import { ARSKNodeContext } from "./ARSKScene";
import { useDoing, DO, DONE, DOING } from "../utils";
const ARSKVideo = ({
  id = UUID(),
  position,
  text,
  url,
  isPlaying = true,
  children
}) => {
  const { SKNodeID: parentSKNode, height, width } = useContext(ARSKNodeContext);
  const [updateState, setUpdateState] = useDoing(DO);
  const [isMounted, setIsMounted] = useState(false);
  const providerValue = useRef({ SKNodeID: id, height, width });
  useEffect(() => {
    if (updateState === DO)
      (async () => {
        try {
          const video = {
            position,
            text,
            width,
            height,
            url,
            isPlaying,
            name: id
          };
          setUpdateState(DOING);
          if (!isMounted) {
            await setSKVideoNode(video, parentSKNode);
            setIsMounted(true);
          } else {
            await updateSKVideoNode(video);
          }
          setUpdateState(DONE);
        } catch (e) {
          setUpdateState(DO);
        }
      })();
    return async () => {
      try {
        await removeSKNode(id);
      } catch (e) {}
    };
  }, [updateState]);
  return (
    isMounted && (
      <SKNodeProvider value={providerValue.current}>{children}</SKNodeProvider>
    )
  );
};
export { ARSKVideo };
export default ARSKVideo;
