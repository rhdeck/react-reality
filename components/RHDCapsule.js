import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";

import { setCapsule } from "../RNSwiftBridge";
export default RHDGeometry(setCapsule, {
  capR: PropTypes.number,
  height: PropTypes.number
});
