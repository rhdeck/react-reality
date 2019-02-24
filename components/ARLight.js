import React, { useContext, useEffect } from "react";
import { processColor } from "react-native";
import { ARNodeContext } from "./ARNode";
import { ARAnimatedContext } from "../ARAnimatedProvider";
import { setLight, removeLight } from "../RNSwiftBridge";
import { ARGeometryProvider } from "./ARGeometry";
import { useUpdateState } from "../utils";
const ARLight = ({ children, updateMaterial, id, ...lightprops }) => {
  const { willNativeUpdate, didnativeUpdate } = useContext(ARAnimatedContext);
  const { nodeID: parentNode } = useContext(ARNodeContext);
  const [triggerUpdate] = useUpdateState(async () => {
    if (willNativeUpdate) await willNativeUpdate();
    await setLight({
      ...lightprops,
      color:
        typeof lightprops.color === "string"
          ? processColor(lightprops.color)
          : lightprops.color
    });
    if (didNativeUpdate) await didnativeUpdate();
  });
  useEffect(
    () => async () => {
      if (!parentNode) return;
      try {
        await removeLight(parentNode);
      } catch (e) {}
    },
    []
  );
  useEffect(() => {
    triggerUpdate();
  });
  return (
    <ARGeometryProvider value={{ numSides: 0 }}>{children}</ARGeometryProvider>
  );
};
export default ARLight;
