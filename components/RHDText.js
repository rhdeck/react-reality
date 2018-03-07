import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";
export default RHDGeometry(
  "Text",
  {
    text: PropTypes.string,
    name: PropTypes.string,
    // weight: PropTypes.string,
    size: PropTypes.number,
    depth: PropTypes.number,
    chamfer: PropTypes.number
  },
  6
);
