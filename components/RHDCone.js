import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";
export default RHDGeometry("Cone", {
  topR: PropTypes.number,
  bottomR: PropTypes.number,
  height: PropTypes.number
});
