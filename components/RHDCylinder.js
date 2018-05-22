import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";
import { setCylinder } from "../RNSwiftBridge";
export default RHDGeometry(setCylinder, {
  radius: PropTypes.number,
  height: PropTypes.number
});
