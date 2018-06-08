import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";

import { setTube } from "../RNSwiftBridge";
export default ARGeometry(
  setTube,
  {
    innerR: PropTypes.number,
    outerR: PropTypes.number,
    height: PropTypes.number
  },
  ({ innerR, outerR }) => {
    if (innerR == outerR) return 2;
    return 4;
  },
  {
    innerR: 0.25,
    outerR: 0.5,
    height: 1
  }
);
