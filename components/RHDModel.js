import PropTypes from "prop-types";
import RHDGeometry from "./RHDGeometry";
import { setModel } from "../RNSwiftBridge";
export default RHDGeometry(
  async ({ path }, nodeID) => {
    console.log("I am going to try to add this path at node", path, nodeID);
    return await setModel(nodeID, path);
  },
  {
    path: PropTypes.string
  },
  0
);
