import React, { Component, createContext } from "react";
import { ARPositionConsumer } from "../ARPositionProvider";
import { ARNodeConsumer } from "./ARNode";
import { ARSessionConsumer } from "../ARSessionProvider";
import { adopt } from "react-adopt";
import { projectNode } from "../RNSwiftBridge";

const { Provider, Consumer } = createContext({ position: {}, orientation: {} });
//#region ARBaseProjectedPointProvider
class ARBaseProjectedPointProvider extends Component {
  state = { providerValue: { position: {}, orientation: {} } };
  render() {
    return (
      <Provider value={this.state.providerValue}>
        {typeof this.props.children == "function"
          ? this.props.children(this.state.providerValue)
          : this.props.children}
      </Provider>
    );
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const ret = prevState;
    ret.todos = {};
    if (nextProps.newPosition) {
      if (
        !prevState.position ||
        JSON.stringify(prevState.position) !=
          JSON.stringify(nextProps.newPosition)
      ) {
        ret.todos.updatePosition = true;
        ret.position = nextProps.newPosition;
      }
    }
    return ret;
  }
  componentDidMount() {
    this.manageTodos();
  }
  componentDidUpdate() {
    this.manageTodos();
  }
  manageTodos() {
    if (!this.state.todos) return;
    Object.keys(this.state.todos).forEach(k => {
      const v = this.state.todos[k];
      if (typeof this[k] == "function") {
        this[k](v);
      }
      this.setState({ todos: null });
    });
  }
  async updatePosition() {
    try {
      const pos = await projectNode(this.props.nodeID);
      this.setState(({ providerValue }) => {
        if (pos.z > 1) {
          console.log("hiding because pos is behind me");
          if (providerValue.position.x) {
            return { providerValue: { position: {}, orientation: {} } };
          } else return { providerValue };
        }
        const z = pos.z;
        const x = parseInt(pos.x);
        if (x == providerValue.position.x) return { providerValue };
        const y = parseInt(pos.y);
        if (y == providerValue.position.y) return { providerValue };
        return { providerValue: { ...providerValue, position: { x, y, z } } };
      });
    } catch (e) {
      console.log("Error in updatePosition", e);
    }
  }
}
//#endregion
//#region ARProjectedPointProvider
const Adoptee = adopt({
  session: <ARSessionConsumer />,
  position: <ARPositionConsumer />,
  node: <ARNodeConsumer />
});
const ARProjectedPointProvider = props => (
  <Adoptee>
    {({
      session: { isStarted },
      position: { position, orientation },
      node: { nodeID }
    }) => {
      if (!isStarted) return null;
      if (!nodeID) return null;
      return (
        <ARBaseProjectedPointProvider
          {...props}
          nodeID={nodeID}
          newPosition={position}
          newOrientation={orientation}
        />
      );
    }}
  </Adoptee>
);
//#endregion
export default ARProjectedPointProvider;
export { ARProjectedPointProvider, Consumer as ARProjectedPointConsumer };
