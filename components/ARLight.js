import React, { useContext, useEffect } from "react";
import { processColor } from "react-native";
import { ARNodeContext } from "./ARNode";
import { ARAnimatedContext } from "../ARAnimatedProvider";
import { setLight, removeLight } from "../RNSwiftBridge";
import { ARGeometryProvider } from "./ARGeometry";
import { useDoing, DO, DONE, DOING } from "../utils";
const ARLight = ({ children, updateMaterial, id, ...lightprops }) => {
  const { willNativeUpdate, didnativeUpdate } = useContext(ARAnimatedContext);
  const { nodeID: parentNode } = useContext(ARNodeContext);
  const [updateState, setUpdateState] = useDoing();
  useEffect(() => {
    if (updateState === DO) {
      async () => {
        try {
          setUpdateState(DOING);
          if (willNativeUpdate) await willNativeUpdate();
          await setLight({
            ...lightprops,
            color:
              typeof lightprops.color === "string"
                ? processColor(lightprops.color)
                : lightprops.color
          });
          if (didNativeUpdate) await didnativeUpdate();
          setUpdateState(DONE);
        } catch (e) {
          setUpdateState(DO);
        }
      };
    }
    return async () => {
      if (!parentNode) return;
      try {
        await removeLight(parentNode);
      } catch (e) {}
    };
  }, [updateState]);
  useEffect(() => setUpdateState(DO));
  return (
    <ARGeometryProvider value={{ numSides: 0 }}>{children}</ARGeometryProvider>
  );
};
export default ARLight;
