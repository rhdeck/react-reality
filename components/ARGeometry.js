import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import filter from "lodash/filter";
import pickBy from "lodash/pickBy";
import { adopt } from "react-adopt";
import { removeGeometry } from "../RNSwiftBridge";
import { ARNodeConsumer } from "./ARNode";
import { ARAnimatedConsumer } from "../ARAnimatedProvider";
const { Provider, Consumer: ARGeometryConsumer } = createContext({});

const ARGeometry = (mountFunc, geomProps, numSides, defaults) => {
  const ARBaseGeometry = class extends Component {
    state = {
      updateState: "doMount" // Finite state: shouldMount, doMount, Mounting, doNext, do, doing, done
    };
    constructor(props) {
      super(props);
      this.state.providerValue = {
        numSides: typeof numSides == "function" ? numSides(props) : numSides
      };
    }
    async nativeUpdate() {
      if (this.state.updateState == "doMount") {
        if (!this.props.parentNode)
          throw new Error("Cannot mount a Geometry without a parent Node");
        this.setState({ updateState: "Mounting" });
        try {
          if (this.props.willNativeUpdate) await this.props.willNativeUpdate();
          await mountFunc(this.state.geomProps, this.props.parentNode);
          if (this.props.didNativeUpdate) await this.props.didNativeUpdate();
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
          if (this.props.willNativeUpdate) await this.props.willNativeUpdate();
          await mountFunc(this.state.geomProps, this.props.parentNode);
          if (this.props.didNativeUpdate) await this.props.didNativeUpdate();
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
          await removeGeometry(this.props.parentNode);
        } catch (e) {}
      };
    }
    render() {
      if (!this.props.children) return null;
      if (
        ["shouldMount", "doMount", "Mounting", "doing"].indexOf(
          this.state.updateState
        ) > -1
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
  ARBaseGeometry.propTypes = {
    ...geomProps,
    parentNode: PropTypes.string,
    willNativeUpdate: PropTypes.func,
    didNativeUpdate: PropTypes.func
  };
  if (defaults) {
    ARBaseGeometry.defaultProps = defaults;
  }
  const geomPropKeys = Object.keys(ARBaseGeometry.propTypes);
  const Adoptee = adopt({
    animated: <ARAnimatedConsumer />,
    node: <ARNodeConsumer />
  });
  const ARGeometry = props => {
    return (
      <Adoptee>
        {({
          animated: { willNativeUpdate, didNativeUpdate },
          node: { nodeID }
        }) => {
          return (
            <ARBaseGeometry
              {...props}
              parentNode={nodeID}
              willNativeUpdate={willNativeUpdate}
              didNativeUpdate={didNativeUpdate}
            />
          );
        }}
      </Adoptee>
    );
  };
  return ARGeometry;
};
export { ARGeometry, ARGeometryConsumer, Provider as ARGeometryProvider };
export default ARGeometry;
