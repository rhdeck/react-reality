import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";
import { setBox } from "../RNSwiftBridge";
export default RHDGeometry(
  setBox,
  {
    width: PropTypes.number,
    height: PropTypes.number,
    length: PropTypes.number,
    chamfer: PropTypes.number
  },
  6
);
