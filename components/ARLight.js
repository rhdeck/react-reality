import React, { useContext, useEffect } from "react";
import { processColor } from "react-native";
import pickBy from "lodash/pickBy";
import { ARNodeContext } from "./ARNode";
import { ARAnimatedContext } from "../ARAnimatedProvider";
import { setLight, removeLight } from "../RNSwiftBridge";
import { ARGeometryProvider } from "./ARGeometry";
import { useDoing, DO, DONE, DOING, makePropDiff } from "../utils";
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
          await setLight(lightprops);
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
  useEffect(() => {
    setUpdateState(DO);
  });
  return (
    ["done", "donext"].includes(updateState) && (
      <ARGeometryProvider value={{ numSides: 0 }}>
        {children}
      </ARGeometryProvider>
    )
  );
};
const propDiff = makePropDiff(props => {
  const temp = pickBy(
    props,
    (_, k) =>
      materialPropertyPropTypeKeys.includes(k) &&
      ["updateMaterial", "id", "willNativeUpdate", "didNativeUpdate"].includes(
        k
      )
  );
  if (typeof temp.color == "string") temp.color = processColor(temp.color);
  return temp;
});
export default ARLight;
