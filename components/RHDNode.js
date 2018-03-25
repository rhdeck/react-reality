import React, { Component, Children } from "react";
import { NativeModules } from "react-native";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import {
  eulerAngles,
  orientation,
  position,
  rotation,
  scale,
  opacity,
  renderingOrder
} from "./lib/propTypes";
import UUID from "uuid/v4";
const { RHDSceneManager } = NativeModules;

class RHDNode extends Component {
  identifier = UUID();
  async componentWillMount() {
    if (this.props.id) {
      this.identifier = this.props.id;
    }
    registeredNodes[this.identifier] = this;
    const filteredProps = pickBy(
      this.props,
      (v, k) => nodeProps.indexOf(k) > -1
    );
    const parentNode = this.props.parentNode ? this.props.parentNode : "";
    await RHDSceneManager.addNode(
      { ...filteredProps, id: this.identifier },
      parentNode
    );
  }
  render() {
    if (!this.props.children) return null;
    const c = Children.map(this.props.children, child => {
      const x = React.cloneElement(child, { parentNode: this.identifier });
      return x;
    });
    return c;
  }
  async componentWillUpdate(nextProps) {
    const filteredProps = pickBy(
      this.props,
      (v, k) => nodeProps.indexOf(k) > -1
    );
    try {
      await RHDSceneMananager.updateNode(this.identifer, filteredProps);
    } catch (e) {}
  }
  async componentWillUnmount() {
    try {
      delete registeredNodes[this.identifier];
      await RHDSceneManager.removeNode(this.identifier);
    } catch (e) {}
  }
}
corePropTypes = {
  eulerAngles,
  orientation,
  position,
  rotation,
  scale,
  renderingOrder,
  opacity,
  id: PropTypes.string,
  parentNode: PropTypes.string
};
var registeredNodes = {};
RHDNode.triggerProp = (nodeID, propName) => {
  const node = registeredNodes[nodeID];
  if (
    node &&
    node.props &&
    node.props[propName] &&
    typeof node.props[propName] == "function"
  ) {
    node.props[propName]();
  }
};
RHDNode.registerNode = (id, node) => {
  registeredNodes[id] = node;
};
const nodeProps = Object.keys(corePropTypes);
RHDNode.propTypes = {
  ...corePropTypes,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func
};
export default RHDNode;
