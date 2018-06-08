import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";

import { setPyramid } from "../RNSwiftBridge";
export default ARGeometry(
  setPyramid,
  {
    width: PropTypes.number,
    length: PropTypes.number,
    height: PropTypes.number
  },
  5,
  {
    width: 1,
    length: 1,
    height: 1
  }
);
