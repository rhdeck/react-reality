import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";

import { setCapsule } from "../RNSwiftBridge";
export default ARGeometry(setCapsule, {
  capR: PropTypes.number,
  height: PropTypes.number
});
