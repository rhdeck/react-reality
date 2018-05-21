import React, { Component, Children } from "react";
import {
  setMaterial,
  setMaterialProperty,
  removeMaterial
} from "../RHDSceneManager";
import PropTypes from "prop-types";
import {
  blendMode,
  lightingModel,
  shaders,
  colorBufferWriteMask,
  fillMode
} from "./lib/propTypes";
import pickBy from "lodash/pickBy";
class RHDMaterial extends Component {
  nativeUpdate() {
    const filteredProps = pickBy(
      this.props,
      (v, k) => materialPropKeys.indexOf(k) > -1
    );
    const index = this.props.index ? this.props.index : 0;
    setMaterial(filteredProps, this.props.parentNode, index);
  }
  componentWillMount() {
    this.nativeUpdate();
  }
  componentWillUpdate(nextProps) {
    this.nativeUpdate();
  }
  async updateMaterial(id, property) {
    try {
      await setMaterialProperty(
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
  componentWillUnmount() {
    removeMaterial(parentNode, index);
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
