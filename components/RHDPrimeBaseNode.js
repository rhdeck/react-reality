import React, { Component, Children } from "react";
import { NativeModules } from "react-native";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import { opacity } from "./lib/propTypes";
import UUID from "uuid/v4";
import RHDNode from "./RHDNode";
const { RHDSceneManager } = NativeModules;

class RHDPrimeBaseNode extends Component {
  identifier = "primebasenode";
  componentWillMount() {
    RHDNode.registerNode(this.identifier, this);
  }
  render() {
    if (!this.props.children) return null;
    const c = Children.map(this.props.children, child => {
      const x = React.cloneElement(child, { parentNode: this.identifier });
      return x;
    });
    return c;
  }
}
const corePropTypes = {
  opacity
};
const nodeProps = Object.keys(corePropTypes);
RHDPrimeBaseNode.propTypes = {
  ...corePropTypes,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func
};

export default RHDPrimeBaseNode;
