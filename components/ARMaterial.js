import React, { createContext, useEffect, useRef } from "react";
import { processColor } from "react-native";
import {
  setMaterial,
  setMaterialProperty,
  removeMaterial
} from "../RNSwiftBridge";
import PropTypes from "prop-types";
import {
  blendMode,
  lightingModel,
  shaders,
  colorBufferWriteMask,
  fillMode
} from "./propTypes";
import { ARNodeContext } from "./ARNode";
import { ARAnimatedContext } from "../ARAnimatedProvider";
import { useDoing, DO, DOING, DONE } from "../utils";
const context = createContext({});
const { Provider, Consumer: ARMaterialConsumer } = context;
const ARMaterial = ({ children, index = 0 }) => {
  const { willNativeUpdate, didNativeUpdate } = useContext(ARAnimatedContext);
  const { nodeID } = useContext(ARNodeContext);
  const [updateState, setUpdateState] = useDoing(DO);
  const providerValue = useRef({
    updateMaterial: async (id, property) => {
      if (willNativeUpdate) await willNativeUpdate();
      await setMaterialProperty(
        {
          ...property,
          color:
            typeof property.color == "string"
              ? processColor(property.color)
              : property.color
        },
        id,
        index,
        nodeID
      );
    },
    parentNode: nodeID,
    index
  });
  useEffect(() => {
    if (updateState === DO) {
      (async () => {
        try {
          setUpdateState(DOING);
          if (willNativeUpdate) await willNativeUpdate();
          await setMaterial(material, nodeID, index);
          if (didNativeUpdate) await didNativeUpdate();
          setUpdateState(DONE);
        } catch (e) {
          setUpdateState(DO);
        }
      })();
    }
    return () => removeMaterial(nodeID, index);
  }, [updateState]);
  return <Provider value={providerValue.current}>{children}</Provider>;
};
ARBaseMaterial.propTypes = {
  parentNode: PropTypes.string,
  index: PropTypes.number,
  metalness: PropTypes.number,
  roughness: PropTypes.number,
  blendMode,
  lightingModel,
  shaders,
  writesToDepthBuffer: PropTypes.bool,
  colorBufferWriteMask,
  doubleSided: PropTypes.bool,
  litPerPixel: PropTypes.bool,
  transparency: PropTypes.number,
  fillMode,
  willNativeUpdate: PropTypes.func,
  didNativeUpdate: PropTypes.func
};

export { ARMaterial, ARMaterialConsumer, context as ARMaterialContext };
export default ARMaterial;
