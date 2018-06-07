import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";

import { setCone } from "../RNSwiftBridge";
export default ARGeometry(setCone, {
  topR: PropTypes.number,
  bottomR: PropTypes.number,
  height: PropTypes.number
});
