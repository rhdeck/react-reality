import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";
import { setCylinder } from "../RNSwiftBridge";
export default ARGeometry(
  setCylinder,
  {
    radius: PropTypes.number,
    height: PropTypes.number
  },
  2,
  {
    radius: 0.5,
    height: 1
  }
);
