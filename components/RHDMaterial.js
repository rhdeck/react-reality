import React, { Component, createContext } from "react";
import { adopt } from "react-adopt";
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
} from "./propTypes";
import pickBy from "lodash/pickBy";
import { RHDNodeConsumer } from "./RHDNode";
import { RHDAnimatedConsumer } from "./RHDAnimatedProvider";
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
      try {
        if (this.props.willNativeUpdate) await this.props.willNativeUpdate();
        setMaterial(filteredProps, this.props.parentNode, index);
        if (this.props.didNativeUpdate) await this.props.didNativeUpdate();
        this.setState({ updateState: "done" });
      } catch (e) {
        this.setState({ updateState: "doMount" });
      }
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
      if (this.props.willNativeUpdate) await this.props.willNativeUpdate();
      await setMaterialProperty(
        property,
        id,
        this.props.index,
        this.props.parentNode
      );
      if (this.props.didNativeUpdate) await this.props.didNativeUpdate();
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
    async () => {
      try {
        removeMaterial(this.props.parentNode, this.props.index);
      } catch (e) {}
    };
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
  fillMode,
  willNativeUpdate: PropTypes.func,
  didNativeUpdate: PropTypes.func
};
const materialPropKeys = Object.keys(RHDBaseMaterial.propTypes);
const Adoptee = adopt({
  animated: <RHDAnimatedConsumer />,
  node: <RHDNodeConsumer />
});
const RHDMaterial = props => {
  return (
    <Adoptee>
      {({
        animated: { willNativeUpdate, didNativeUpdate },
        node: { nodeID }
      }) => {
        return (
          <RHDBaseMaterial
            {...props}
            parentNode={nodeID}
            willNativeUpdate={willNativeUpdate}
            didNativeUpdate={didNativeUpdate}
          />
        );
      }}
      }}
    </Adoptee>
  );
};
export { RHDMaterial, RHDMaterialConsumer };
export default RHDMaterial;
