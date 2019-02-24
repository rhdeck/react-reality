import React, { useRef, useContext, useState } from "react";
import {
  removeSKNode,
  setSKVideoNode,
  updateSKVideoNode
} from "../RNSwiftBridge";
import UUID from "uuid/v4";
import { ARSKNodeContext } from "./ARSKScene";
import { useUpdateState } from "../utils";
const ARSKVideo = ({
  id = UUID(),
  position,
  text,
  url,
  isPlaying = true,
  children
}) => {
  const { SKNodeID: parentSKNode, height, width } = useContext(ARSKNodeContext);
  useUpdateState(async () => {
    const video = {
      position,
      text,
      width,
      height,
      url,
      isPlaying,
      name: id
    };
    if (!isMounted) {
      await setSKVideoNode(video, parentSKNode);
      setIsMounted(true);
    } else {
      await updateSKVideoNode(video);
    }
  });
  const [isMounted, setIsMounted] = useState(false);
  const providerValue = useRef({ SKNodeID: id, height, width });
  useEffect(
    () => async () => {
      try {
        await removeSKNode(id);
      } catch (e) {}
    },
    []
  );
  return (
    isMounted && (
      <SKNodeProvider value={providerValue.current}>{children}</SKNodeProvider>
    )
  );
};
export { ARSKVideo };
export default ARSKVideo;
