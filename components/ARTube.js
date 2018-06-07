import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";

import { setTube } from "../RNSwiftBridge";
export default ARGeometry(setTube, {
  innerR: PropTypes.number,
  outerR: PropTypes.number,
  height: PropTypes.number
});
