import React, { Component, Children } from "react";
import { NativeModules, processColor } from "react-native";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import includes from "lodash/includes";
const { RHDSceneManager } = NativeModules;

class RHDMaterialProperty extends Component {
  componentWillUpdate(nextProps) {}
  //   shouldComponentUpdate() {
  //     return false;
  //   }
  componentWillUnmount() {}
  render() {
    const filteredProps = pickBy(
      this.props,
      (v, k) => !includes(["updateMaterial", "id"], k)
    );
    this.props.updateMaterial(this.props.id, filteredProps);
    return null;
  }
}
RHDMaterialProperty.propTypes = {
  updateMaterial: PropTypes.func,
  id: PropTypes.string,
  path: PropTypes.string,
  color: PropTypes.number,
  intensity: PropTypes.number
};
materialPropertyPropTypeKeys = Object.keys(RHDMaterialProperty.propTypes);
export default RHDMaterialProperty;
