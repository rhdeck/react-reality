import React, { Component, Children, createContext } from "react";
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
  state = {};
  constructor(props) {
    super(props);
    this.state.materialPropertyProps = this.setMaterialPropertyProps(true);
  }

  nativeUpdate() {
    const filteredProps = pickBy(
      this.props,
      (v, k) => materialPropKeys.indexOf(k) > -1
    );
    const index = this.props.index ? this.props.index : 0;
    setMaterial(filteredProps, this.props.parentNode, index);
  }
  componentDidMount() {
    this.manageTodos();
  }
  componentDidUpdate() {
    this.manageTodos();
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
    return (
      <Provider value={this.state.materialPropertyProps}>
        {this.props.children}
      </Provider>
    );
  }

  setMaterialPropertyProps(skipState) {
    const materialPropertyProps = {
      updateMaterial: this.updateMaterial.bind(this),
      parentNode: this.props.parentNode,
      index: this.props.index
    };
    if (!skipState)
      this.setState(
        {
          materialPropertyProps
        },
        () => {
          this.nativeUpdate();
        }
      );
    return materialPropertyProps;
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    var ret = prevState;
    if (!ret.todo) ret.todo = {};
    if (nextProps.index != prevState.index) {
      {
        ret.index = nextProps.index;
        ret.todo.setMaterialPropertyProps = true;
      }
    }
    if (!ret.todo) delete ret.todo;
    return ret;
  }
  manageTodos() {
    if (this.state.todos) {
      Object.keys(this.state.todos).forEach(k => {
        if (typeof this[k] == "function") {
          this[k](this.state.todos[k]);
        }
      });
      this.setState({ todos: null });
    }
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
  return;
  <RHDNodeConsumer>
    {({ nodeId }) => {
      return <RHDBaseMaterial {...this.props} parentNode={nodeId} />;
    }}
  </RHDNodeConsumer>;
};
export { RHDMaterial, RHDMaterialConsumer };
export default RHDMaterial;
