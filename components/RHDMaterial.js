import React, { Component, Children } from "react";
import { NativeModules } from "react-native";
import PropTypes from "prop-types";
import {
  blendMode,
  lightingModel,
  shaders,
  colorBufferWriteMask,
  fillMode
} from "./lib/propTypes";
import pickBy from "lodash/pickBy";
const { RHDSceneManager } = NativeModules;
class RHDMaterial extends Component {
  componentWillMount() {
    const filteredProps = pickBy(
      this.props,
      (v, k) => materialPropKeys.indexOf(k) > -1
    );
    const index = this.props.index ? this.props.index : 0;
    RHDSceneManager.setMaterial(filteredProps, this.props.parentNode, index);
  }
  componentWillUpdate(nextProps) {}
  async updateMaterial(id, property) {
    try {
      await RHDSceneManager.setMaterialProperty(
        property,
        id,
        this.props.index,
        this.props.parentNode
      );
    } catch (e) {}
  }
  render() {
    if (!this.props.children) return null;
    const c = Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        updateMaterial: (id, property) => this.updateMaterial(id, property),
        parentNode: this.props.parentNode,
        index: this.props.index
      });
    });

    return c;
  }
  async componentWillUnmount() {
    try {
      await RHDSceneManager.removeMaterial(parentNode, index);
    } catch (e) {}
  }
}
RHDMaterial.propTypes = {
  parentNode: PropTypes.string,
  index: PropTypes.number,
  metalness: PropTypes.number,
  roughness: PropTypes.number,
  blendMode,
  lightingModel,
  shaders,
  writesToDepthBuffer: PropTypes.bool,
  colorBufferWriteMask,
  doubleSided: PropTypes.bool,
  litPerPixel: PropTypes.bool,
  transparency: PropTypes.number,
  fillMode
};
const materialPropKeys = Object.keys(RHDMaterial.propTypes);
export default RHDMaterial;
