import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";

import { setSphere } from "../RNSwiftBridge";
export default RHDGeometry(
  setSphere,
  {
    radius: PropTypes.number
  },
  1
);
