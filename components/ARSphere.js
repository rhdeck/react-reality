import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";

import { setSphere } from "../RNSwiftBridge";
export default ARGeometry(
  setSphere,
  {
    radius: PropTypes.number
  },
  1,
  {
    radius: 0.5
  }
);
