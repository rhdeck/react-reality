import React, { Component, Children } from "react";
import { NativeModules } from "react-native";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
const { RHDSceneManager } = NativeModules;

class RHDSKLabel extends Component {
  async nativeUpdate() {
    const label = PickBy(this.props, (v, k) => {
      SKLabelKeys.indexOf(k) > -1;
    });
    const result = await RHDSceneManager.addSKLabelNode(
      label,
      this.props.parentSKNode
    );
    return result;
  }
  componentWillMount() {}
  conponentWillUpdate() {}
  render() {
    nativeUpdate();
    if (!this.props.children) return null;
    const c = Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        parentSKNode: this.props.id
      });
    });
    return c;
  }
  async componentWillUnmount() {
    result = RHDSceneManager.removeNode();
  }
}
RHDSKLabel.propTypes = {
  parentSKNode: PropTypes.string,
  text: PropTypes.string,
  id: PropTypes.String,
  fontName: PropTypes.String,
  fontSize: PropTypes.Number,
  fontColor: PropTypes.number, // Note this requires a preprocessed color
  width: PropTypes.number
};
const SKLabelKeys = Object.keys(RHDSKLabel.propTypes);
export default RHDSKLabel;
