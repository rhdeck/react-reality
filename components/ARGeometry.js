import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { removeGeometry } from "../RNSwiftBridge";
import { ARNodeContext } from "./ARNode";
import { ARAnimatedContext } from "../ARAnimatedProvider";
import { ARSessionContext } from "../ARSessionProvider";
import { usePrevious, useDoing, DO, DONE, DOING, makePropDiff } from "../utils";
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
              await mountFunc(geomProps, parentNode);
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
    const prevProps = usePrevious(props);
    useEffect(() => {
      if (propDiff(prevProps, props))
        setUpdateState(updateDate == "done" ? "do" : "donext");
    });
    return (
      isMounted && (
        <Provider value={providerValue.current}>{props.children}</Provider>
      )
    );
  };
  const propDiff = makePropDiff(geomPropKeys);
  ARGeom.propTypes = {
    ...geomProps,
    parentNode: PropTypes.string,
    willNativeUpdate: PropTypes.func,
    didNativeUpdate: PropTypes.func
  };
  if (defaults) {
    ARGeom.defaultProps = defaults;
  }
  const geomPropKeys = Object.keys(ARGeom.propTypes);
  return ARGeom;
};
export {
  ARGeometry,
  ARGeometryConsumer,
  Provider as ARGeometryProvider,
  context as ARGeometryContext
};
export default ARGeometry;
