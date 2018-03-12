import React, { Component, Children } from "react";
import { NativeModules } from "react-native";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
const { RHDSceneManager } = NativeModules;

class RHDSKScene extends Component {
  async nativeUpdate() {
    const scene = pickBy(this.props, (v, k) => {
      return sceneKeys.indexOf(k) > -1;
    });
    const result = await RHDSceneManager.addSKScene(
      scene,
      this.props.parentNode,
      this.props.index,
      this.props.materialProperty
    );
    return result;
  }
  async componentWillMount() {
    await nativeUpdate();
  }
  componentWillUpdate() {}
  render() {
    if (!this.props.children) return null;
    const c = Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        parentSKNode: this.props.id
      });
    });
    return c;
  }
  componentWillUnmount() {}
}

RHDSKScene.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  id: PropTypes.string,
  color: PropTypes.number, // Requires processcolor
  parentNode: PropTypes.string,
  index: PropTypes.number,
  materialProperty: PropTypes.string
};
const sceneKeys = Object.keys(RHDSKScene.propTypes);
export default RHDSKScene;
