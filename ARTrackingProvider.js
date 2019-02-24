import React, { createContext, useState, useRef, useEffect } from "react";
import {
  getAnchors,
  setImageDetection,
  subscribeToARImageEvent,
  subscribeToARPlaneEvent,
  setPlaneDetection,
  addRecognizerImage,
  removeRecognizerImage,
  subscribeToARCameraState
} from "./RNSwiftBridge";
import consumerIf from "consumerif";
import { useDiffObject } from "./utils";
const context = createContext();
const { Provider, Consumer: ARTrackingConsumer } = context;
const ARTrackingProvider = ({
  planeDetection = "none",
  imageDetection = false,
  onUpdateAnchors,
  images,
  children
}) => {
  const [providerValue, setProviderValue] = useState();
  const [trackingLevel, setTrackingLevel] = useState("notAvailable");
  const [anchors, setAnchors] = useState({});
  const cameraStateRef = useRef(null);
  useEffect(() => {
    cameraStateRef.current = subscribeToARCameraState(setTrackingLevel);
    return () => cameraStateRef && cameraStateRef.current.remove();
  }, []);
  const planeDetectionRef = useRef(null);
  useEffect(() => {
    if (["horizontal", "vertical", "both"].indexOf(planeDetection) > -1) {
      setPlaneDetection(planeDetection);
      planeDetectionRef.current = subscribeToARPlaneEvent(
        async ({ data } = {}) => {
          if (!data) {
            const anchors = cleanAnchors(await getAnchors(data));
            setAnchors(anchors);
          } else
            switch (data.key) {
              case "planeAnchorAdded":
              case "planeAnchorChanged":
                const { id } = data;
                const anchor = cleanAnchor(data.anchor);
                setAnchors(anchors => ({ ...anchors, [id]: anchor }));
                break;
              case "planeAnchorRemoved":
              default:
                const anchors = cleanAnchors(await getAnchors(data));
                setAnchors(anchors);
            }
        }
      );
    } else if (this.planeDetection) {
      setPlaneDetection("none");
      planeDetectionRef.current.remove();
      planeDetectionRef.current = null;
    }
    return () => {
      if (planeDetectionRef) {
        setPlaneDetection("none");
        planeDetectionRef.current.remove();
      }
    };
  }, [planeDetection]);
  const imageDetectionRef = useRef(null);
  useEffect(() => {
    setImageDetection(imageDetection);
    if (imageDetection)
      imageDetectionRef.current = subscribeToARImageEvent(async data => {
        const anchors = await getAnchors(data);
        setAnchors(anchors);
      });
    else if (imageDetectionRef.current) {
      imageDetectionRef.current.remove();
      imageDetectionRef.current = null;
    }
    return () => {
      if (imageDetectionRef) imageDetectionRef.remove();
    };
  }, [imageDetection]);
  useDiffObject(images, {
    onAdd: (k, { width, url }) => addRecognizerImage(url, k, width),
    onRemove: k => removeRecognizerImage(k)
  });
  useEffect(() => {
    setProviderValue({ anchors, trackingLevel });
    if (onUpdateAnchors) onUpdateAnchors(anchors);
  }, [anchors, trackingLevel]);
  return (
    <Provider value={providerValue}>
      {consumerIf(children, ARTrackingConsumer)}
    </Provider>
  );
};
export { ARTrackingProvider, ARTrackingConsumer, context as ARTrackingContext };
export default ARTrackingProvider;
const cleanAnchors = (o = {}) =>
  Object.entries(o).reduce((o, [k, v]) => ({ ...o, [k]: cleanAnchor(v) }), {});
const cleanAnchor = v => {
  var out = {};
  if (!v) return out;
  if (v.plane) {
    if (v.plane.width)
      v.plane.width = parseFloat(parseFloat(v.plane.width).toFixed(1));
    if (v.plane.height)
      v.plane.height = parseFloat(parseFloat(v.plane.height).toFixed(1));
  }
  return v;
};
