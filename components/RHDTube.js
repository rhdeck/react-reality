import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";
export default RHDGeometry("Tube", {
  innerR: PropTypes.number,
  outerR: PropTypes.number,
  height: PropTypes.number
});
