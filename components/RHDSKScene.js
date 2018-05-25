import React, { Component, createContext } from "react";
import { addSKScene } from "../RHDSceneManager";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import UUID from "uuid/v4";
import { RHDMaterialPropertyConsumer } from "./RHDMaterialProperty";
import { RHDMaterial } from "..";
const {
  Provider: RHDSKNodeProvider,
  Consumer: RHDSKNodeConsumer
} = createContext({});
class RHDBaseSKScene extends Component {
  identifier = UUID();
  constructor(props) {
    super(props);
    this.state = { providerValue: { SKNodeID: SKNode } };
  }
  async nativeUpdate() {
    const scene = {
      ...pickBy(this.props, (v, k) => {
        return sceneKeys.indexOf(k) > -1;
      }),
      name: this.identifier
    };
    const result = await addSKScene(
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
    return (
      <RHDSKNodeProvider value={this.state.providerValue}>
        {this.props.children}
      </RHDSKNodeProvider>
    );
  }
  componentWillUnmount() {}
}

RHDBaseSKScene.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  id: PropTypes.string,
  color: PropTypes.number, // Requires processcolor
  parentNode: PropTypes.string,
  index: PropTypes.number,
  materialProperty: PropTypes.string
};
const sceneKeys = Object.keys(RHDBaseSKScene.propTypes);

const RHDSKScene = props => {
  return (
    <RHDMaterialPropertyConsumer>
      {({ parentNode, id, index }) => {
        return <RHDBaseSKScene {...{ ...props, parentNode, id, index }} />;
      }}
    </RHDMaterialPropertyConsumer>
  );
};
export { RHDSKScene, RHDSKNodeConsumer, RHDSKNodeProvider };
export default RHDSKScene;
