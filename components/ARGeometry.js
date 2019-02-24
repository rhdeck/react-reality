import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { removeGeometry } from "../RNSwiftBridge";
import { ARNodeContext } from "./ARNode";
import { ARAnimatedContext } from "../ARAnimatedProvider";
import { ARSessionContext } from "../ARSessionProvider";
import { useDoing, DO, DONE, DOING } from "../utils";
const context = createContext({});
const { Provider, Consumer: ARGeometryConsumer } = context;
const ARGeometry = (mountFunc, geomProps, numSides, defaults) => {
  const ARGeom = props => {
    const { willNativeUpdate, didNativeUpdate } = useContext(ARAnimatedContext);
    const { nodeID: parentNode } = useContext(ARNodeContext);
    const [updateState, setUpdateState] = useDoing(DO);
    const { isStarted } = useContext(ARSessionContext);
    const [isMounted, setMounted] = useState(false);
    const providerValue = useRef({
      numSides: typeof numSides == "function" ? numSides(props) : numSides
    });
    useEffect(() => {
      if (isStarted) {
        if (updateState === DO) {
          (async () => {
            try {
              setUpdateState(DOING);
              if (willNativeUpdate) await willNativeUpdate();
              await mountFunc(
                Object.entries(props)
                  .filter(([k, _]) => geomKeys.includes(k))
                  .reduce(o, ([k, v]) => ({ ...o, [k]: v }), {}),
                parentNode
              );
              if (didNativeUpdate) await didNativeUpdate();
              setMounted(true);
              setUpdateState(DONE);
            } catch (e) {
              setUpdateState(DO);
            }
          })();
        }
      }
      return async () => {
        try {
          if (!parentNode) return;
          await removeGeometry(parentNode);
        } catch (e) {}
      };
    }, [updateState, isStarted]);
    useEffect(
      () => {
        setUpdateState(DO);
      },
      Object.entries(props)
        .filter(([k, _]) => geomKeys.includes(k))
        .map(([k, v]) => v)
    );
    return (
      isMounted && (
        <Provider value={providerValue.current}>{props.children}</Provider>
      )
    );
  };
  const geomKeys = Object.keys(geomProps);
  ARGeom.propTypes = {
    ...geomProps,
    parentNode: PropTypes.string,
    willNativeUpdate: PropTypes.func,
    didNativeUpdate: PropTypes.func
  };
  if (defaults) {
    ARGeom.defaultProps = defaults;
  }
  return ARGeom;
};
export {
  ARGeometry,
  ARGeometryConsumer,
  Provider as ARGeometryProvider,
  context as ARGeometryContext
};
export default ARGeometry;
