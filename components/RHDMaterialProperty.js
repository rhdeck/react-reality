import React, { Component, Children, createContext } from "react";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import includes from "lodash/includes";
import { RHDMaterialConsumer } from "./RHDMaterial";
import { create } from "domain";
const { Provider, Consumer: RHDMaterialPropertyConsumer } = createContext({});
class RHDBaseMaterialProperty extends Component {
  constructor(props) {
    super(props);
    this.state.providerValue = {
      parentNode: this.props.parentNode,
      index: this.props.index,
      materialProperty: this.props.id
    };
  }
  render() {
    const filteredProps = pickBy(
      this.props,
      (v, k) =>
        materialPropertyPropTypeKeys.indexOf(k) > -1 &&
        !includes(["updateMaterial", "id"], k)
    );
    this.props.updateMaterial(this.props.id, filteredProps);
    if (!this.props.children) return null;
    return (
      <Provider value={this.state.providerValue}>
        {this.props.children}
      </Provider>
    );
  }
}
RHDBaseMaterialProperty.propTypes = {
  updateMaterial: PropTypes.func,
  id: PropTypes.string,
  path: PropTypes.string,
  color: PropTypes.number,
  intensity: PropTypes.number
};
materialPropertyPropTypeKeys = Object.keys(RHDBaseMaterialProperty.propTypes);

const RHDMaterialProperty = props => {
  return (
    <RHDMaterialConsumer>
      {({ updateMaterial, parentNode, index }) => {
        return (
          <RHDBaseMaterialProperty
            {...props}
            updateMaterial={updateMaterial}
            parentNode={parentNode}
            index={index}
          />
        );
      }}
    </RHDMaterialConsumer>
  );
};
export default RHDMaterialProperty;
