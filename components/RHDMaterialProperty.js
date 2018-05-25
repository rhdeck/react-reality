import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import includes from "lodash/includes";
import { RHDMaterialConsumer } from "./RHDMaterial";
const { Provider, Consumer: RHDMaterialPropertyConsumer } = createContext({});
class RHDBaseMaterialProperty extends Component {
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
      console.log("I am a-mounting", this.state.filteredProps);
      await this.props.updateMaterial(this.props.id, this.state.filteredProps);
      this.setState(({ updateState }) => {
        return { updateState: updateState == "doNext" ? "do" : "done" };
      });
    }
    if (this.state.updateState == "do") {
      this.setState({ updateState: "doing" });
      await this.props.updateMaterial(this.props.id, this.state.filteredProps);
      this.setState(({ updateState }) => {
        return { updateState: updateState == "doNext" ? "do" : "done" };
      });
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
const propFilter = props => {
  return pickBy(
    props,
    (v, k) =>
      materialPropertyPropTypeKeys.indexOf(k) > -1 &&
      !includes(["updateMaterial", "id"], k)
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
export { RHDMaterialProperty, RHDMaterialPropertyConsumer };
export default RHDMaterialProperty;
