import React, {
  createContext,
  useContext,
  useEffect,
  useDoing,
  DO,
  DONE,
  DOING,
  usePrevious,
  useRef
} from "react";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import includes from "lodash/includes";
import { ARMaterialContext } from "./ARMaterial";
import { ARAnimatedContext } from "../ARAnimatedProvider";
import consumerIf from "consumerif";
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
  const previousProps = usePrevious(props);
  useEffect(() => {
    if (propDiff(props, previousProps)) setUpdateState(DO);
  }, [props]);
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
  intensity: PropTypes.number,
  willNativeUpdate: PropTypes.func,
  didNativeUpdate: PropTypes.func
};
materialPropertyPropTypeKeys = Object.keys(ARMaterialProperty.propTypes);
const propDiff = makePropDiff(props =>
  pickBy(
    props,
    (_, k) =>
      materialPropertyPropTypeKeys.indexOf(k) > -1 &&
      !includes(
        ["updateMaterial", "id", "willNativeUpdate", "didNativeUpdate"],
        k
      )
  )
);
export {
  ARMaterialProperty,
  ARMaterialPropertyConsumer,
  ARMaterialPropertyContext
};
export default ARMaterialProperty;
