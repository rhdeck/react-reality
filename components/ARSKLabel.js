import React, { useState, useContext, useRef, useEffect } from "react";
import { processColor } from "react-native";
import {
  removeSKNode,
  setSKLabelNode,
  updateSKLabelNode
} from "../RNSwiftBridge";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import UUID from "uuid/v4";
import {
  ARSKNodeProvider,
  ARSKNodeConsumer,
  ARSKNodeContext
} from "./ARSKScene";
import { useDoing, DO, DOING, DONE } from "../utils";
const ARSKLabel = ({
  allowScaling = true,
  position,
  parentSKNode,
  text,
  id,
  fontName,
  fontSize,
  fontColor,
  horizontalAlignment,
  verticalAlignment,
  lineBreak,
  lines,
  children
}) => {
  const SKNodeID = useRef(UUID());
  const [updateState, setUpdateState] = useDoing(DO);
  const [isMounted, setIsMounted] = useState(false);
  const { SKNodeID: parentSKNode, height, width } = useContext(ARSKNodeContext);
  const [providerValue, setProviderValue] = useState({
    SKNodeID: SKNodeID.current
  });
  useEffect(() => {
    setUpdateState(DO);
  }, [
    position,
    parentSKNode,
    text,
    id,
    fontName,
    fontSize,
    fontColor,
    height,
    width,
    horizontalAlignment,
    verticalAlignment,
    allowScaling,
    lineBreak,
    lines
  ]);
  useEffect(() => {
    if (updateState === DO)
      (async () => {
        try {
          setUpdateState(DOING);
          const label = propFilter({
            position,
            parentSKNode,
            text,
            id,
            fontName,
            fontSize,
            fontColor,
            height,
            width,
            horizontalAlignment,
            verticalAlignment,
            allowScaling,
            lineBreak,
            line,
            name: SKNodeID.current
          });
          if (!isMounted) {
            await setSKLabelNode(label, parentSKNode);
            setIsMounted(true);
          } else await updateSKLabelNode(label);
          setUpdateState(DONE);
        } catch (e) {
          setUpdateState(DO);
        }
      })();
    return async () => {
      try {
        await removeSKNode(SKNodeID.current);
      } catch (e) {}
    };
  }, [updateState]);
  useEffect(() => {
    setProviderValue({ SKNodeID: SKNodeID.current, height, width });
  }, [SKNodeID, height, width]);
  return <ARSKNodeProvider value={providerValue}>{children}</ARSKNodeProvider>;
};
ARBaseSKLabel.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  parentSKNode: PropTypes.string,
  text: PropTypes.string,
  id: PropTypes.string,
  fontName: PropTypes.string,
  fontSize: PropTypes.number,
  fontColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Note this requires a preprocessed color
  width: PropTypes.number,
  horizontalAlignment: PropTypes.string,
  verticalAlignment: PropTypes.string,
  allowScaling: PropTypes.bool,
  lineBreak: PropTypes.string,
  lines: PropTypes.number
};
const SKLabelKeys = Object.keys(ARBaseSKLabel.propTypes);
const propFilter = props => {
  const temp = {
    ...pickBy(props, (_, k) => SKLabelKeys.includes(k))
  };
  if (typeof temp.fontColor == "string")
    temp.fontColor = processColor(temp.fontColor);
  return temp;
};
ARSKLabel.propTypes = { ...ARBaseSKLabel.propTypes };
export { ARSKLabel, ARSKNodeConsumer };
export default ARSKLabel;
