import React, { Component, Children } from "react";
import { NativeModules } from "react-native";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import UUID from "uuid/v4";
const { RHDSceneManager } = NativeModules;

class RHDSKScene extends Component {
  identifier = UUID();
  async nativeUpdate() {
    const scene = {
      ...pickBy(this.props, (v, k) => {
        return sceneKeys.indexOf(k) > -1;
      }),
      name: this.identifier
    };
    const result = await RHDSceneManager.addSKScene(
      scene,
      this.props.parentNode,
      this.props.index,
      this.props.materialProperty
    );
    return result;
  }
  async componentWillMount() {
    if (this.props.id) {
      this.identifier = this.props.id;
    }
    await this.nativeUpdate();
  }
  componentWillUpdate() {}
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
