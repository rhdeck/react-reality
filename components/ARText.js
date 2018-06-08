import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";

import { setText } from "../RNSwiftBridge";
export default ARGeometry(
  setText,
  {
    text: PropTypes.string,
    fontName: PropTypes.string,
    // weight: PropTypes.string,
    size: PropTypes.number,
    depth: PropTypes.number,
    chamfer: PropTypes.number
  },
  ({ chamfer }) => {
    if (chamfer) return 4;
    return 3;
  },
  {
    size: 12,
    depth: 0.1,
    chamfer: 0
  }
);
