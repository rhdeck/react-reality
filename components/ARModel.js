import PropTypes from "prop-types";
import ARGeometry from "./ARGeometry";
import { setModel } from "../RNSwiftBridge";
export default ARGeometry(
  async ({ path }, nodeID) => {
    console.log("I am going to try to add this path at node", path, nodeID);
    return await setModel(nodeID, path);
  },
  {
    path: PropTypes.string
  },
  0
);
