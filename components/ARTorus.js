import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";
import { setTorus } from "../RNSwiftBridge";
export default ARGeometry(
  setTorus,
  {
    ringR: PropTypes.number,
    pipeR: PropTypes.number
  },
  1,
  {
    ringR: 0.5,
    pipeR: 0.25
  }
);
