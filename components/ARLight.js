import React, { Component } from "react";
import PropTypes from "prop-types";
import { adopt } from "react-adopt";
import { processColor } from "react-native";
import pickBy from "lodash/pickBy";
import includes from "lodash/includes";
import { ARNodeConsumer } from "./ARNode";
import { ARAnimatedConsumer } from "../ARAnimatedProvider";
import { setLight, removeLight } from "../RNSwiftBridge";
import { ARGeometryProvider } from "./ARGeometry";
class ARBaseLight extends Component {
  state = { updateState: "doMount" };
  render() {
    if (!this.props.children) return null;
    if (
      ["shouldMount", "doMount", "Mounting", "doing"].indexOf(
        this.state.updateState
      ) > -1
    )
      return null;
    //Setting no-op geometryprovider so if someone adds materials underneath, they get ignored.
    return (
      <ARGeometryProvider value={{ numSides: 0 }}>
        {this.props.children}
      </ARGeometryProvider>
    );
  }
  componentWillUnmount() {
    if (!this.props.parentNode)
      throw new Error("Cannot mount a Geometry without a parent Node");
    async () => {
      try {
        await removeLight(this.props.parentNode);
      } catch (e) {}
    };
  }
  componentDidMount() {
    this.nativeUpdate();
  }
  componentDidUpdate() {
    this.nativeUpdate();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    var ret = prevState;
    if (propDiff(prevState.lightProps, nextProps)) {
      if (["shouldMount", "doMount"].indexOf(ret.updateState) == -1) {
        ret.updateState =
          ["doing", "Mounting"].indexOf(prevState.updateState) > -1
            ? "doNext"
            : "do";
      }
      ret.lightProps = propFilter(nextProps);
    }
    return ret;
  }
  async nativeUpdate() {
    if (this.state.updateState == "doMount") {
      if (!this.props.parentNode)
        throw new Error("Cannot mount a Geometry without a parent Node");
      this.setState({ updateState: "Mounting" });
      try {
        if (this.props.willNativeUpdate) await this.props.willNativeUpdate();
        await setLight(this.state.lightProps, this.props.parentNode);
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
        await setLight(this.state.lightProps, this.props.parentNode);
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
}
const Adoptee = adopt({
  animated: <ARAnimatedConsumer />,
  node: <ARNodeConsumer />
});
const ARLight = props => {
  return (
    <Adoptee>
      {({
        animated: { willNativeUpdate, didNativeUpdate },
        node: { nodeID }
      }) => {
        return (
          <ARBaseLight
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
const propFilter = props => {
  const temp = pickBy(
    props,
    (v, k) =>
      materialPropertyPropTypeKeys.indexOf(k) > -1 &&
      !includes(
        ["updateMaterial", "id", "willNativeUpdate", "didNativeUpdate"],
        k
      )
  );
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

export default ARLight;
