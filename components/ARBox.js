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
  6,
  {
    height: 1,
    width: 1,
    length: 1,
    chamfer: 0
  }
);
