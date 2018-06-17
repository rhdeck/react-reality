import React, { Component, createContext } from "react";
import { addSKScene, removeSKScene, updateSKScene } from "../ARSceneManager";
import { processColor } from "react-native";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import UUID from "uuid/v4";
import { ARMaterialPropertyConsumer } from "./ARMaterialProperty";
const {
  Provider: ARSKNodeProvider,
  Consumer: ARSKNodeConsumer
} = createContext({});
class ARBaseSKScene extends Component {
  state = {
    identifier: UUID(),
    updateState: "doMount" // "doMount", "Mounting", "donext", "do", "doing", "done"
  };
  updateProviderValue() {
    this.setState({
      providerValue: {
        SKNodeID: this.state.identifier,
        height: this.props.height,
        width: this.props.width
      },
      todos: {}
    });
  }
  constructor(props) {
    super(props);
    this.state.providerValue = {
      SKNodeID: this.state.identifier,
      height: this.props.height,
      width: this.props.width
    };
  }
  async nativeUpdate() {
    if (this.state.updateState == "doMount") {
      this.setState({ updateState: "Mounting" });
      try {
        const filteredProps = propFilter(this.props);
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
    ret.todos = {};
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
    if (
      nextProps.height != prevState.providerValue.height ||
      nextProps.width != prevState.providerValue.width
    ) {
      ret.todos["updateProviderValue"] = true;
    }
    return ret;
  }
  componentDidMount() {
    this.manageTodos();
    this.nativeUpdate();
  }
  componentDidUpdate() {
    this.manageTodos();
    this.nativeUpdate();
  }
  manageTodos() {
    if (this.state.todos && Object.keys(this.state.todos).length) {
      Object.keys(this.state.todos).forEach(k => {
        if (typeof this[k] == "function") this[k](this.state.todos[k]);
      });
      this.setState({ todos: {} });
    }
  }
  render() {
    if (!this.props.children) return null;
    if (["doMount", "Mounting"].indexOf(this.state.updateState) > -1)
      return null;
    return (
      <ARSKNodeProvider value={this.state.providerValue}>
        {typeof this.props.children == "function" ? (
          <ARSKNodeConsumer>
            {value => {
              return this.props.children(value);
            }}
          </ARSKNodeConsumer>
        ) : (
          this.props.children
        )}
      </ARSKNodeProvider>
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

ARBaseSKScene.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  id: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  parentNode: PropTypes.string,
  index: PropTypes.number,
  materialProperty: PropTypes.string
};

ARBaseSKScene.defaultProps = {
  height: 100,
  width: 100
};
const sceneKeys = Object.keys(ARBaseSKScene.propTypes);

const ARSKScene = props => {
  return (
    <ARMaterialPropertyConsumer>
      {({ parentNode, materialProperty, index }) => {
        return (
          <ARBaseSKScene
            {...{ ...props, parentNode, materialProperty, index }}
          />
        );
      }}
    </ARMaterialPropertyConsumer>
  );
};
export { ARSKScene, ARSKNodeConsumer, ARSKNodeProvider };
export default ARSKScene;

const propFilter = props => {
  const temp = {
    ...pickBy(props, (v, k) => sceneKeys.indexOf(k) > -1)
  };
  if (typeof temp.color == "string") temp.color = processColor(temp.color);
  return temp;
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
