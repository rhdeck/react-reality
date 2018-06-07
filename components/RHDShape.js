import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";

import { setShape } from "../RNSwiftBridge";
export default RHDGeometry(
  setShape,
  {
    extrusion: PropTypes.number,
    pathSvg: PropTypes.string,
    pathFlatness: PropTypes.number,
    chamferMode: PropTypes.number,
    chamferRadius: PropTypes.number,
    chamferProfilePathSvg: PropTypes.string,
    chamferProfilePathFlatness: PropTypes.number
  },
  props => {
    var temp = 4; // Default where there is extrusion and chamfer but only one side - bezeled extruded disc
    if (!props.extrusion) {
      temp = 1; // Basically a plane
    } else if (props.chamferRadius == 0) {
      temp = 3; // There is extrusion but no chamfer - like an extruded disc
    } else if (props.chamferMode == 0) {
      temp = 5; // THere is extrusion and double-chamfer - extruded disc with bezeling front and back
    }
    console.log("I am rendering sides for shape", temp);
  }
);
