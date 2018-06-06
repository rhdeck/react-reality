import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";
import { setScene } from "../RNSwiftBridge";
export default RHDGeometry(
  async ({ path }, nodeID) => {
    return await setScene(nodeID, path);
  },
  {
    path: PropTypes.string
  }
);
