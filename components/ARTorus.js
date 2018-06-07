import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";

import { setTorus } from "../RNSwiftBridge";
export default ARGeometry(setTorus, {
  ringR: PropTypes.number,
  pipeR: PropTypes.number
});
