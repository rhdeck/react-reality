import React, { createContext, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ARMaterialContext } from "./ARMaterial";
import { ARAnimatedContext } from "../ARAnimatedProvider";
import consumerIf from "consumerif";
import { useDoing, DO, DONE, DOING } from "../utils";
const ARMaterialPropertyContext = createContext({});
const {
  Provider,
  Consumer: ARMaterialPropertyConsumer
} = ARMaterialPropertyContext;
const ARMaterialProperty = ({ id = "diffuse", children, ...props }) => {
  const { updateMaterial, parentNode, index } = useContext(ARMaterialContext);
  const { willNativeUpdate, didNativeUpdate } = useContext(ARAnimatedContext);
  const [updateState, setUpdateState] = useDoing(DONE);
  const providerValue = useRef({ parentNode, index, id });
  useEffect(() => setUpdateState(DO), props);
  useEffect(() => {
    (async () => {
      if (updateState == DO) {
        try {
          setUpdateState(DOING);
          if (willNativeUpdate) await willNativeUpdate();
          updateMaterial(id, props);
          if (didNativeUpdate) await didNativeUpdate();
          setUpdateState(DONE);
        } catch (e) {
          setUpdateState(DO);
        }
      }
    })();
  }, [updateState]);
  return (
    <Provider value={providerValue}>
      {consumerIf(children, ARMaterialPropertyConsumer)}
    </Provider>
  );
};
ARMaterialProperty.propTypes = {
  updateMaterial: PropTypes.func,
  id: PropTypes.string,
  path: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  intensity: PropTypes.number
};
materialPropertyPropTypeKeys = Object.keys(ARMaterialProperty.propTypes);
export {
  ARMaterialProperty,
  ARMaterialPropertyConsumer,
  ARMaterialPropertyContext
};
export default ARMaterialProperty;
