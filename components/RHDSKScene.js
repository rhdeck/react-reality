import React, { Component, createContext } from "react";
import { addSKScene, removeSKScene, updateSKScene } from "../RHDSceneManager";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import UUID from "uuid/v4";
import { RHDMaterialPropertyConsumer } from "./RHDMaterialProperty";
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
          ...propFilter(this.props),
          name: this.state.identifier
        };
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
        this.setState({ updateState: "doMount" });
      }
    } else if (this.state.updateState == "do") {
      this.setState({ updateState: "doing" });
      try {
        const scene = {
          ...propFilter(this.props),
          name: this.state.identifier
        };
        await updateSKScene(
          scene,
          this.props.parentNode,
          this.props.index,
          this.props.materialProperty
        );
        this.setState(({ updateState }) => {
          return { updateState: updateState == "donext" ? "do" : "done" };
        });
      } catch (e) {
        this.setState({ updateState: "do" });
      }
      const scene = {};
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
    if (propDiff(prevState.sceneProps, nextProps, propFilter)) {
      ret.sceneProps = propFilter(nextProps);
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

const propFilter = props => {
  return {
    ...pickBy(props, (v, k) => sceneKeys.indexOf(k) > -1)
  };
};

const propDiff = (a, b) => {
  if (a === b) return false;
  if (a & !b || !a & b) return true;
  const af = propFilter(a);
  const bf = propFilter(b);

  const afk = Object.keys(af);
  const bfk = Object.keys(bf);
  if (afk.length != bfk.length) return true;
  if (
    afk.filter(k => {
      return bfk.indexOf(k) === -1;
    }).length
  )
    return true;
  if (
    afk.filter(k => {
      return bf[k] != af[k];
    }).length
  )
    return true;
};
