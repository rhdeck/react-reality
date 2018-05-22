import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";

import { setTorus } from "../RNSwiftBridge";
export default RHDGeometry(setTorus, {
  ringR: PropTypes.number,
  pipeR: PropTypes.number
});
