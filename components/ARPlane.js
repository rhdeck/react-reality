import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";
import { setPlane } from "../RNSwiftBridge";
export default ARGeometry(
  setPlane,
  {
    width: PropTypes.number,
    height: PropTypes.number,
    cornerRadius: PropTypes.number,
    cornerSegmentCount: PropTypes.number,
    widthSegmentCount: PropTypes.number,
    heightSegmentCount: PropTypes.number
  },
  1,
  {
    width: 1,
    height: 1,
    cornerRadius: 0
  }
);
