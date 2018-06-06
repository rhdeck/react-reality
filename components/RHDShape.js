import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";

import { setShape } from "../RNSwiftBridge";
export default RHDGeometry(
  setShape,
  {
    extrusion: PropTypes.number,
    pathSvg: PropTypes.string,
    pathFlatness: PropTypes.number,
    chamferMode,
    chamferRadius: PropTypes.number,
    chamferProfilePathSvg: PropTypes.string,
    chamferProfilePathFlatness: PropTypes.number
  },
  props => {
    if (!props.extrusion) {
      return 1;
    } else if (props.chamferRadius == 0) {
      return 3;
    } else if (props.chamferMode == 0) {
      return 5;
    } else return 4;
  }
);
