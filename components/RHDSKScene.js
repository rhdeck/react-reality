import React, { Component, createContext } from "react";
import { addSKScene } from "../RHDSceneManager";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import UUID from "uuid/v4";
import { RHDMaterialPropertyConsumer } from "./RHDMaterialProperty";
import { RHDMaterial } from "..";
import { removeSKScene } from "../RNSwiftBridge";
const {
  Provider: RHDSKNodeProvider,
  Consumer: RHDSKNodeConsumer
} = createContext({});
class RHDBaseSKScene extends Component {
  state = {
    identifier: UUID(),
    updateState: "doMount" // "doMount", "Mounting", "donext", "do", "doing", "done"
  };
  constructor(props) {
    super(props);
    this.state.providerValue = { SKNodeID: this.state.identifier };
  }
  async nativeUpdate() {
    if (this.state.updateState == "doMount") {
      this.setState({ updateState: "Mounting" });
      try {
        const scene = {
          ...pickBy(this.props, (v, k) => {
            return sceneKeys.indexOf(k) > -1;
          }),
          name: this.state.identifier
        };
        console.log("Adding SKNode");
        const result = await addSKScene(
          scene,
          this.props.parentNode,
          this.props.index,
          this.props.materialProperty
        );
        this.setState(({ updateState }) => {
          return { updateState: updateState == "donext" ? "do" : "done" };
        });
      } catch (e) {
        console.log("SKScene Mount Error", e);
        this.setState({ updateState: "doMount" });
      }
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    var ret = prevState;
    if (nextProps.id && prevState.identifier != nextProps.id) {
      ret.identifier = nextProps.id;
      if (["doMount", "Mounting"].indexOf(ret.updateState) == -1)
        ret.updateState =
          ["doing", "Mounting"].indexOf(ret.updateState) == -1
            ? "do"
            : "donext";
    }
    return ret;
  }
  componentDidMount() {
    this.nativeUpdate();
  }
  componentDidUpdate() {
    this.nativeUpdate();
  }
  render() {
    if (!this.props.children) return null;
    if (["doMount", "Mounting"].indexOf(this.state.updateState) > -1)
      return null;
    return (
      <RHDSKNodeProvider value={this.state.providerValue}>
        {this.props.children}
      </RHDSKNodeProvider>
    );
  }
  componentWillUnmount() {
    removeSKScene(
      this.props.parentNode,
      this.props.index,
      this.props.materialProperty
    );
  }
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
      {({ parentNode, materialProperty, index }) => {
        return (
          <RHDBaseSKScene
            {...{ ...props, parentNode, materialProperty, index }}
          />
        );
      }}
    </RHDMaterialPropertyConsumer>
  );
};
export { RHDSKScene, RHDSKNodeConsumer, RHDSKNodeProvider };
export default RHDSKScene;
