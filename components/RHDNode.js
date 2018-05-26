import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import { RHDARConsumer } from "../RHDARWrapper";
import { RHDAnimatedConsumer } from "./RHDAnimated";
import {
  eulerAngles,
  orientation,
  position,
  rotation,
  scale,
  opacity,
  renderingOrder
} from "./lib/propTypes";
import UUID from "uuid/v4";
import { addNode, removeNode, updateNode } from "../RHDSceneManager";
const { Provider, Consumer: RHDNodeConsumer } = createContext({});
//#region BaseNode
class RHDBaseNode extends Component {
  state = {
    updateState: "shouldmount", // Valid values: "shouldmount", "domount", "mounting", "donext", "do", "doing", "done"
    identifier: null
  };
  constructor(props) {
    super(props);
    this.state.identifier = props.id ? props.id : UUID();
    this.state.providerValue = { nodeID: this.state.identifier };
  }
  componentDidMount() {
    this.nativeUpdate();
    if (this.props.registerNode)
      this.props.registerNode(this.state.identifier, this);
  }
  render() {
    if (!this.props.children) return null;
    if (
      ["shouldmount", "domount", "mounting"].indexOf(this.state.updateState) >
      -1
    ) {
      return null;
    }
    return (
      <Provider value={this.state.providerValue}>
        {this.props.children}
      </Provider>
    );
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    var ret = prevState;
    if (propDiff(prevState.nodeProps, nextProps, filterObj)) {
      //Change to node
      if (prevState.updateState != "donext") {
        ret.updateState =
          prevState.updateState == "shouldmount"
            ? "domount"
            : ["mounting", "doing"].indexOf(prevState.updateState) > -1
              ? "donext"
              : "do";
      }
      ret.nodeProps = filterObj(nextProps);
    }
    return ret;
  }
  componentDidUpdate() {
    this.nativeUpdate();
  }
  async nativeUpdate() {
    if (this.state.updateState == "domount") {
      this.setState({ updateState: "mounting" });
      try {
        console.log("Node mounting");
        const parentNode = this.props.parentNode ? this.props.parentNode : "";
        const np = { ...this.state.nodeProps, id: this.state.identifier };
        // if (typeof this.props.willNativeUpdate == "function")
        //   await this.props.willNativeUpdate();
        await addNode(np, parentNode);
        // if (typeof this.props.willNativeUpdate == "function")
        //   await this.props.didNativeUpdate();
        this.setState(({ updateState }) => {
          return { updateState: updateState == "donext" ? "do" : "done" };
        });
      } catch (e) {
        this.setState({ updateState: "domount" });
      }
    } else if (this.state.updateState == "do") {
      this.setState({ updateState: "doing" });
      console.log("Node updating");
      try {
        if (typeof this.props.willNativeUpdate == "function")
          await this.props.willNativeUpdate();
        await updateNode(this.state.identifier, this.state.nodeProps);
        if (typeof this.props.willNativeUpdate == "function")
          await this.props.didNativeUpdate();
        this.setState(({ updateState }) => {
          return { updateState: updateState == "donext" ? "do" : "done" };
        });
      } catch (e) {
        this.setState({ updateState: "do" });
      }
    }
  }
  componentWillUnmount() {
    try {
      removeNode(this.state.identifier);
      if (this.props.removeNode) this.props.removeNode(this.state.identifier);
    } catch (e) {}
  }
}
corePropTypes = {
  eulerAngles,
  orientation,
  position,
  rotation,
  scale,
  renderingOrder,
  opacity,
  id: PropTypes.string,
  parentNode: PropTypes.string
};
const nodeProps = Object.keys(corePropTypes);
RHDBaseNode.propTypes = {
  ...corePropTypes,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  willNativeUpdate: PropTypes.func,
  didNativeUpdate: PropTypes.func
};
//#endregion
//#region RHDNode
const RHDNode = props => {
  return (
    <RHDARConsumer>
      {({ registerNode, removeNode, isStarted }) => {
        if (!isStarted) {
          return null;
        } else {
          return (
            <RHDNodeConsumer>
              {({ nodeID }) => {
                return (
                  <RHDAnimatedConsumer>
                    {({ willNativeUpdate, didNativeUpdate }) => {
                      return (
                        <RHDBaseNode
                          parentNode={nodeID ? nodeID : ""}
                          {...props}
                          registerNode={registerNode}
                          removeNode={removeNode}
                          willNativeUpdate={willNativeUpdate}
                          didNativeUpdate={didNativeUpdate}
                        />
                      );
                    }}
                  </RHDAnimatedConsumer>
                );
              }}
            </RHDNodeConsumer>
          );
        }
      }}
    </RHDARConsumer>
  );
};
RHDNode.propTypes = {
  ...RHDBaseNode.propTypes
};
//#endregion
//#region Utility functions
const filterObj = obj => {
  return pickBy(obj, (v, k) => nodeProps.indexOf(k) > -1);
};

const propDiff = (a, b, func) => {
  if (a === b) return false;
  if (a & !b || !a & b) return true;
  const af = func ? func(a) : a;
  const bf = func ? func(b) : b;
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
      if (bf[k] == af[k]) return false;
      if (typeof af[k] == "object") {
        return propDiff(af[k], bf[k]);
      }
      return true;
    }).length
  )
    return true;
};
//#endregion
export { RHDNode, RHDNodeConsumer };
export default RHDNode;
