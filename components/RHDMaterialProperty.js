import React, { Component, Children } from "react";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import includes from "lodash/includes";
class RHDMaterialProperty extends Component {
  render() {
    const filteredProps = pickBy(
      this.props,
      (v, k) =>
        materialPropertyPropTypeKeys.indexOf(k) > -1 &&
        !includes(["updateMaterial", "id"], k)
    );
    this.props.updateMaterial(this.props.id, filteredProps);
    if (!this.props.children) return null;
    const c = Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        parentNode: this.props.parentNode,
        index: this.props.index,
        materialProperty: this.props.id
      });
    });

    return c;
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
