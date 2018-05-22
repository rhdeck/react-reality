import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";

import { setCone } from "../RNSwiftBridge";
export default RHDGeometry(setCone, {
  topR: PropTypes.number,
  bottomR: PropTypes.number,
  height: PropTypes.number
});
