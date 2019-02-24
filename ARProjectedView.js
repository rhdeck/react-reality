import React, { useContext } from "react";
import { ARSessionContext } from "./ARSessionProvider";
import { ARNodeContext } from "./components/ARNode";
import { ARProjectedView as SwiftARProjectedView } from "./RNSwiftBridge";
const ARProjectedView = ({ style, ...props }) => {
  const { isStarted } = useContext(ARSessionContext);
  const { nodeID: parentNode } = useContext(ARNodeContext);
  return (
    isStarted && (
      <SwiftARProjectedView
        {...props}
        parentNode={parentNode}
        style={[style, { position: "absolute" }]}
      />
    )
  );
};
export default ARProjectedView;
