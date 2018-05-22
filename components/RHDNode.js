import React, { Component, Children } from "react";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import { RHDARConsumer } from "../RHDARWrapper";
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
import { addNode, removeNode, updateNode } from "../RHDSceneManager";

const RHDNode = props => {
  return (
    <RHDARConsumer>
      {value => {
        if (!value.isStarted) {
          return null;
        } else {
          return (
            <RHDBaseNode
              {...props}
              registerNode={value.registerNode}
              removeNode={value.removeNode}
            />
          );
        }
      }}
    </RHDARConsumer>
  );
};

class RHDBaseNode extends Component {
  state = {
    isMounted: false
  };
  identifier = UUID();
  componentDidMount() {
    if (this.props.id) {
      this.identifier = this.props.id;
    }
    const filteredProps = pickBy(
      this.props,
      (v, k) => nodeProps.indexOf(k) > -1
    );
    const parentNode = this.props.parentNode ? this.props.parentNode : "";
    (async () => {
      await addNode({ ...filteredProps, id: this.identifier }, parentNode);
      this.setState({ isMounted: true });
    })();
    if (this.props.registerNode) this.props.registerNode(this.identifier, this);
  }
  render() {
    if (!this.props.children) return null;
    if (!this.state.isMounted) {
      console.log("Not yet mounted", this.identifier);
      return null;
    }
    console.log("Mounting children of node", this.identifier);
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
      await updateNode(this.identifer, filteredProps);
    } catch (e) {}
  }
  componentWillUnmount() {
    try {
      removeNode(this.identifier);
      if (this.props.removeNode) this.props.removeNode(this.identifier);
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
const nodeProps = Object.keys(corePropTypes);
RHDBaseNode.propTypes = {
  ...corePropTypes,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func
};

RHDNode.propTypes = {
  ...RHDBaseNode.propTypes
};
export default RHDNode;
