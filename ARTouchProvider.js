import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import { doTap } from "./ARSceneManager";
const { Provider, Consumer: ARTouchConsumer } = createContext({});
class ARTouchProvider extends Component {
  registeredNodes = {};
  constructor(props) {
    super(props);
    this.state = {
      providerValue: {
        registerNode: this.registerNode.bind(this),
        removeNode: this.removeNode.bind(this),
        triggerAtLocation: this.triggerAtLocation.bind(this)
      }
    };
  }
  async getNodesFromLocation(x, y) {
    const out = await doTap(x, y);
    return out;
  }
  async triggerAtLocation(prop, x, y) {
    const out = await this.getNodesFromLocation(x, y);
    if (out.nodes && out.nodes.length) {
      for (var x = 0; x < out.nodes.length; x++) {
        if (this.triggerProp(out.nodes[x], prop)) break;
      }
    }
  }
  triggerProp(nodeID, propName) {
    const node = this.registeredNodes[nodeID];
    if (
      node &&
      node.props &&
      node.props[propName] &&
      typeof node.props[propName] == "function"
    ) {
      node.props[propName]();
      return true;
    }
    return false;
  }
  registerNode(id, node) {
    this.registeredNodes[id] = node;
  }
  removeNode(id) {
    delete this.registeredNodes[id];
  }
  render() {
    return (
      <Provider value={this.state.providerValue}>
        {typeof this.props.children == "function" ? (
          <ARTouchConsumer>{this.props.children}</ARTouchConsumer>
        ) : (
          this.props.children
        )}
      </Provider>
    );
  }
}
export { ARTouchProvider, ARTouchConsumer };
export default ARTouchProvider;
