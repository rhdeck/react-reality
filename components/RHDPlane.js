import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";
import { setPlane } from "../RNSwiftBridge";
export default RHDGeometry(
  setPlane,
  {
    width: PropTypes.number,
    height: PropTypes.number,
    cornerRadius: PropTypes.number,
    cornerSegmentCount: PropTypes.number,
    widthSegmentCount: PropTypes.number,
    heightSegmentCount: PropTypes.number
  },
  1
);
