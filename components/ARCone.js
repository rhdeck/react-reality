import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";
import { setCone } from "../RNSwiftBridge";
export default ARGeometry(
  setCone,
  {
    topR: PropTypes.number,
    bottomR: PropTypes.number,
    height: PropTypes.number
  },
  ({ topR, bottomR }) => {
    if (topR > 0 && bottomR > 0) {
      return 3;
    }
    return 2;
  },
  {
    topR: 0,
    bottomR: 0.5,
    height: 1
  }
);
