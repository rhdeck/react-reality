import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";
import { setBox } from "../RNSwiftBridge";
export default ARGeometry(
  setBox,
  {
    width: PropTypes.number,
    height: PropTypes.number,
    length: PropTypes.number,
    chamfer: PropTypes.number
  },
  6
);
