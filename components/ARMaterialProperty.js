import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import includes from "lodash/includes";
import { adopt } from "react-adopt";
import { ARMaterialConsumer } from "./ARMaterial";
import { ARAnimatedConsumer } from "../ARAnimatedProvider";
const { Provider, Consumer: ARMaterialPropertyConsumer } = createContext({});
class ARBaseMaterialProperty extends Component {
  state = {
    updateState: "doMount" // valid states: doMount, Mounting, doNext, do, doing, done
  };
  constructor(props) {
    super(props);
    this.state.providerValue = {
      parentNode: this.props.parentNode,
      index: this.props.index,
      materialProperty: this.props.id
    };
    this.state.filteredProps = propFilter(this.props);
  }

  render() {
    if (!this.props.children) return null;
    if (["doMount", "Mounting"].indexOf(this.state.updateState) > -1)
      return null;
    return (
      <Provider value={this.state.providerValue}>
        {this.props.children}
      </Provider>
    );
  }
  async nativeUpdate() {
    if (this.state.updateState == "doMount") {
      this.setState({ updateState: "Mounting" });
      try {
        if (typeof this.props.willNativeUpdate == "function")
          await this.props.willNativeUpdate();
        await this.props.updateMaterial(
          this.props.id,
          this.state.filteredProps
        );
        if (typeof this.props.didNativeUpdate == "function")
          await this.props.didNativeUpdate();
        this.setState(({ updateState }) => {
          return { updateState: updateState == "doNext" ? "do" : "done" };
        });
      } catch (e) {
        this.setState({ updateState: "doMount" });
      }
    }
    if (this.state.updateState == "do") {
      this.setState({ updateState: "doing" });
      try {
        if (typeof this.props.willNativeUpdate == "function")
          await this.props.willNativeUpdate();
        await this.props.updateMaterial(
          this.props.id,
          this.state.filteredProps
        );
        if (typeof this.props.didNativeUpdate == "function")
          await this.props.didNativeUpdate();
        this.setState(({ updateState }) => {
          return { updateState: updateState == "doNext" ? "do" : "done" };
        });
      } catch (e) {
        this.setState({ updateState: "do" });
      }
    }
  }
  componentDidMount() {
    this.nativeUpdate();
  }
  componentDidUpdate() {
    this.nativeUpdate();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const ret = prevState;
    if (propDiff(prevState.filteredProps, nextProps, propFilter)) {
      ret.filteredProps = propFilter(nextProps);
      if (prevState.updateState != "doMount") {
        ret.updateState =
          ["doing", "mounting"].indexOf(prevState.updateState) > -1
            ? "doNext"
            : "do";
      }
    }
    return ret;
  }
}
ARBaseMaterialProperty.propTypes = {
  updateMaterial: PropTypes.func,
  id: PropTypes.string,
  path: PropTypes.string,
  color: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
  intensity: PropTypes.number,
  willNativeUpdate: PropTypes.func,
  didNativeUpdate: PropTypes.func
};
ARBaseMaterialProperty.defaultProps = {
  id: "diffuse"
};
materialPropertyPropTypeKeys = Object.keys(ARBaseMaterialProperty.propTypes);
const Adoptee = adopt({
  animated: <ARAnimatedConsumer />,
  material: <ARMaterialConsumer />
});
const ARMaterialProperty = props => {
  return (
    <Adoptee>
      {({
        animated: { willNativeUpdate, didNativeUpdate },
        material: { updateMaterial, parentNode, index }
      }) => {
        return (
          <ARBaseMaterialProperty
            {...props}
            updateMaterial={updateMaterial}
            parentNode={parentNode}
            index={index}
            willNativeUpdate={willNativeUpdate}
            didNativeUpdate={didNativeUpdate}
          />
        );
      }}
    </Adoptee>
  );
};
const propFilter = props => {
  return pickBy(
    props,
    (v, k) =>
      materialPropertyPropTypeKeys.indexOf(k) > -1 &&
      !includes(
        ["updateMaterial", "id", "willNativeUpdate", "didNativeUpdate"],
        k
      )
  );
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
export { ARMaterialProperty, ARMaterialPropertyConsumer };
export default ARMaterialProperty;
