import PropTypes from "prop-types";
import React, { Component } from "react";
import { ARSessionConsumer } from "./ARSessionProvider";
import { ARNodeConsumer } from "./components/ARNode";
import { adopt } from "react-adopt";
import { SwiftARProjectedView } from "./RNSwiftBridge";

const ARBaseProjectedView = props => (
  <SwiftARProjectedView
    {...props}
    style={[props.style, { position: "absolute" }]}
  />
);
const Adoptee = adopt({
  session: <ARSessionConsumer />,
  node: <ARNodeConsumer />
});
const ARProjectedView = props => {
  return (
    <Adoptee>
      {({ session: { isStarted }, node: { nodeID } }) => {
        if (!isStarted) return null;
        return <ARBaseProjectedView parentNode={nodeID} {...props} />;
      }}
    </Adoptee>
  );
};

ARProjectedView.propTypes = {
  parentNode: PropTypes.string
};
export default ARProjectedView;
