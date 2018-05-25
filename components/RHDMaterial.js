import React, { Component, createContext } from "react";
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
import { RHDNodeConsumer } from "./RHDNode";
const { Provider, Consumer: RHDMaterialConsumer } = createContext({});
class RHDBaseMaterial extends Component {
  state = {
    updateState: "doMount" // States: doMount, Mounting, (doNext, doing,) done
  };
  constructor(props) {
    super(props);
    this.state.materialPropertyProps = {
      updateMaterial: this.updateMaterial.bind(this),
      parentNode: this.props.parentNode,
      index: this.props.index
    };
  }
  async nativeUpdate() {
    if (this.state.updateState == "doMount") {
      const filteredProps = pickBy(
        this.props,
        (v, k) => materialPropKeys.indexOf(k) > -1
      );
      const index = this.props.index ? this.props.index : 0;
      this.setState({ updateState: "Mounting" });
      setMaterial(filteredProps, this.props.parentNode, index);
      this.setState({ updateState: "done" });
    }
  }
  componentDidMount() {
    this.nativeUpdate();
  }
  componentDidUpdate() {
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
    } catch (e) {
      console.log("Uh oh , mp error", e);
    }
  }
  render() {
    if (["doMount", "Mounting"].indexOf(this.state.updateState) > -1)
      return null;
    if (!this.props.children) return null;
    return (
      <Provider value={this.state.materialPropertyProps}>
        {this.props.children}
      </Provider>
    );
  }
  componentWillUnmount() {
    removeMaterial(parentNode, index);
  }
}
RHDBaseMaterial.propTypes = {
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
const materialPropKeys = Object.keys(RHDBaseMaterial.propTypes);

const RHDMaterial = props => {
  return (
    <RHDNodeConsumer>
      {({ nodeID }) => {
        return <RHDBaseMaterial {...props} parentNode={nodeID} />;
      }}
    </RHDNodeConsumer>
  );
};
export { RHDMaterial, RHDMaterialConsumer };
export default RHDMaterial;
