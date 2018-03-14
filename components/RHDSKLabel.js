import React, { Component, Children } from "react";
import { NativeModules } from "react-native";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import UUID from "uuid/v4";
const { RHDSceneManager } = NativeModules;

class RHDSKLabel extends Component {
  identifier = UUID();
  async nativeUpdate() {
    const label = {
      ...pickBy(this.props, (v, k) => SKLabelKeys.indexOf(k) > -1),
      name: this.identifier
    };
    const result = await RHDSceneManager.setSKLabelNode(
      label,
      this.props.parentSKNode
    );
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
    const c = Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        parentSKNode: this.identifier
      });
    });
    return c;
  }
  async componentWillUnmount() {
    const result = await RHDSceneManager.removeSKNode(this.identifier);
    return result;
  }
}
RHDSKLabel.propTypes = {
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
const SKLabelKeys = Object.keys(RHDSKLabel.propTypes);
export default RHDSKLabel;
