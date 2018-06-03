import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";
import { setScene } from "../RNSwiftBridge";
export default RHDGeometry(
  async ({ path }, nodeID) => {
    console.log("I am going to try to add this path at node", path, nodeID);
    return await setScene(nodeID, path);
  },
  {
    path: PropTypes.string
  }
);
