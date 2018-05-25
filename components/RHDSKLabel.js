import React, { Component, Children } from "react";
import { removeSKNode, setSKLabelNode } from "../RHDSceneManager";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import UUID from "uuid/v4";
import { RHDSKNodeProvider, RHDSKNodeConsumer } from "./RHDSKScene";
class RHDBaseSKLabel extends Component {
  identifier = UUID();
  async nativeUpdate() {
    const label = {
      ...pickBy(this.props, (v, k) => SKLabelKeys.indexOf(k) > -1),
      name: this.identifier
    };
    const result = await setSKLabelNode(label, this.props.parentSKNode);
    return result;
  }
  componentWillMount() {
    if (this.props.id) {
      this.identifier = this.props.id;
    }
  }
  conponentWillUpdate() {}
  render() {
    this.nativeUpdate();
    if (!this.props.children) return null;
    return (
      <RHDSKNodeProvider value={this.state.providerValue}>
        {this.props.children}
      </RHDSKNodeProvider>
    );
  }
  async componentWillUnmount() {
    const result = await removeSKNode(this.identifier);
    return result;
  }
}
RHDBaseSKLabel.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  parentSKNode: PropTypes.string,
  text: PropTypes.string,
  id: PropTypes.string,
  fontName: PropTypes.string,
  fontSize: PropTypes.number,
  fontColor: PropTypes.number, // Note this requires a preprocessed color
  width: PropTypes.number
};
const SKLabelKeys = Object.keys(RHDBaseSKLabel.propTypes);
const RHDSKLabel = props => {
  return (
    <RHDSKNodeConsumer>
      {({ SKNodeID }) => {
        return <RHDBaseSKLabel {...props} parentSKNode={SKNodeID} />;
      }}
    </RHDSKNodeConsumer>
  );
};
RHDSKLabel.propTypes = { ...RHDBaseSKLabel.propTypes };
export { RHDSKLabel, RHDSKNodeConsumer };

export default RHDSKLabel;
