import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";

import { setTube } from "../RNSwiftBridge";
export default RHDGeometry(setTube, {
  innerR: PropTypes.number,
  outerR: PropTypes.number,
  height: PropTypes.number
});
