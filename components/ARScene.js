import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";
import { setScene } from "../RNSwiftBridge";
export default ARGeometry(
  async ({ path }, nodeID) => setScene(nodeID, path),
  {
    path: PropTypes.string
  },
  0
);
