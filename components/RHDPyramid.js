import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";

import { setPyramid } from "../RNSwiftBridge";
export default RHDGeometry(setPyramid, {
  width: PropTypes.number,
  length: PropTypes.number,
  height: PropTypes.number
});
