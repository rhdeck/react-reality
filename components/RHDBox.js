import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";
export default RHDGeometry(
  "Box",
  {
    width: PropTypes.number,
    height: PropTypes.number,
    length: PropTypes.number,
    chamfer: PropTypes.number
  },
  6
);
