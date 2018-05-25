import React, { Component, Children, createContext } from "react";
import PropTypes from "prop-types";
import filter from "lodash/filter";
import pickBy from "lodash/pickBy";
import { removeGeometry } from "../RHDSceneManager";
import { RHDNodeConsumer } from "./RHDNode";
const { Provider, Consumer: RHDGeometryConsumer } = createContext({});
const RHDGeometry = (mountFunc, geomProps, numSides) => {
  const RHDBaseGeometry = class extends Component {
    state = {
      updateState: "doMount" // Finite state: shouldMount, doMount, Mounting, doNext, do, doing, done
    };
    constructor(props) {
      super(props);
      this.state.providerValue = { numSides };
    }
    async nativeUpdate() {
      if (this.state.updateState == "doMount") {
        if (!this.props.parentNode)
          throw new Error("Cannot mount a Geometry without a parent Node");
        this.setState({ updateState: "Mounting" });
        try {
          await mountFunc(this.state.geomProps, this.props.parentNode);
          this.setState(({ updateState }) => {
            return { updateState: updateState == "doNext" ? "do" : "done" };
          });
        } catch (e) {
          this.setState({ updateState: "doMount" });
          console.log("I got an error", e);
        }
      } else if (this.state.updateState == "do") {
        if (!this.props.parentNode)
          throw new Error("Cannot mount a Geometry without a parent Node");
        this.setState({ updateState: "doing" });
        try {
          //DO something
          this.setState(({ updateState }) => {
            return { updateState: updateState == "doNext" ? "do" : "done" };
          });
        } catch (e) {
          console.log("I got an error", e);
          this.setState({ updateState: "doMount" });
        }
      }
    }
    componentWillUnmount() {
      if (!this.props.parentNode)
        throw new Error("Cannot mount a Geometry without a parent Node");
      async () => {
        try {
          await RHDSceneManager.removeGeometry(this.props.parentNode);
        } catch (e) {}
      };
    }
    render() {
      if (!this.props.children) return null;
      if (
        ["shouldMount", "doMount", "Mounting"].indexOf(this.state.updateState) >
        -1
      )
        return null;
      return (
        <Provider value={this.state.providerValue}>
          {this.props.children}
        </Provider>
      );
    }
    componentDidMount() {
      this.nativeUpdate();
    }
    componentDidUpdate() {
      this.nativeUpdate();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
      var ret = prevState;
      if (propDiff(prevState.geomProps, nextProps)) {
        if (["shouldMount", "doMount"].indexOf(ret.updateState) == -1)
          ret.updateState =
            ["doing", "Mounting"].indexOf(prevState.updateState) > -1
              ? "doNext"
              : "do";
        ret.geomProps = propFilter(nextProps);
      }
      return ret;
    }
  };
  const propFilter = props => {
    return pickBy(props, (v, k) => {
      return geomPropKeys.indexOf(k) > -1;
    });
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
  RHDBaseGeometry.propTypes = {
    ...geomProps,
    parentNode: PropTypes.string
  };
  const geomPropKeys = Object.keys(RHDBaseGeometry.propTypes);
  const RHDGeometry = props => {
    return (
      <RHDNodeConsumer>
        {({ nodeID }) => {
          return <RHDBaseGeometry {...props} parentNode={nodeID} />;
        }}
      </RHDNodeConsumer>
    );
  };
  return RHDGeometry;
};
export { RHDGeometry, RHDGeometryConsumer };
export default RHDGeometry;
