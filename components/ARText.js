import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";

import { setText } from "../RNSwiftBridge";
export default ARGeometry(
  setText,
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
