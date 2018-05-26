import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import {
  addPlaneDetection,
  removePlaneDetection,
  clear,
  pause,
  resume,
  getAnchors,
  setImageDetection,
  removeImageDetection,
  doTap,
  setAnimationDuration,
  setAnimationType,
  removeAnimation
} from "./RHDSceneManager";
const { Provider, Consumer: RHDARConsumer } = createContext();
class RHDARWrapper extends Component {
  state = {
    planeDetection: false,
    imageDetection: false,
    transition: 0,
    anchors: {},
    providerValue: this.setProviderValue(true)
  };
  constructor(props) {
    super(props);
    this.state.providerValue = this.setProviderValue(true);
  }
  start() {
    (async () => {
      try {
        await resume();
      } catch (e) {}
      try {
        await clear();
      } catch (e) {}
      this.setState({ isStarted: true }, () => {
        this.setProviderValue();
      });
    })();
  }
  stop() {
    pause();
  }
  setProviderValue(skipState) {
    const providerValue = {
      isStarted: this.state && this.state.isStarted,
      anchors: this.state ? this.state.anchors : {},
      registerNode: this.registerNode.bind(this),
      removeNode: this.removeNode.bind(this),
      triggerAtLocation: this.triggerAtLocation.bind(this),
      start: this.start.bind(this),
      stop: this.stop.bind(this)
    };
    if (!skipState) this.setState({ providerValue });
    return providerValue;
  }
  render() {
    return (
      <Provider value={this.state.providerValue}>
        {typeof this.props.children == "function" ? (
          <RHDARConsumer>{this.props.children}</RHDARConsumer>
        ) : (
          this.props.children
        )}
      </Provider>
    );
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const ret = prevState ? prevState : {};
    if (!ret.todos) ret.todos = {};
    if (nextProps.planeDetection != prevState.planeDetection) {
      ret.todos["setPlaneDetection"] = nextProps.planeDetection;
      ret.planeDetection = nextProps.planeDetection;
    }
    if (nextProps.imageDetection != prevState.imageDetection) {
      ret.todos["setImageDetection"] = nextProps.imageDetection;
      ret.imageDetection = nextProps.imageDetection;
    }
    if (!ret.todos || Object.keys(ret.todos) == 0) {
      delete ret.todos;
    }
    return ret;
  }
  componentDidUpdate() {
    if (this.state.todos) {
      Object.keys(this.state.todos).forEach(k => {
        if (typeof this[k] == "function") {
          this[k](this.state.todos[k]);
        }
      });
      this.setState({ todos: null }, () => {
        this.setProviderValue();
      });
    }
  }
  setPlaneDetection(newValue) {
    if (newValue) addPlaneDetection(this.updatePlanes.bind(this));
    else removePlaneDetection();
  }
  setImageDetection(newValue) {
    if (newValue) addImageDetection(this.updateImages.bind(this));
    else removeImageDetection();
  }
  setAnimationDuration(newValue) {
    console.log("Sending duration directive of ", newValue);
    if (!newValue) removeAnimation();
    else setAnimationDuration(newValue);
  }
  setAnimationEasing(newValue) {
    console.log("sending animatino type of ", newValue);
    setAnimationType(newValue);
  }
  async updatePlanes(data) {
    const anchors = await getAnchors(data);
    this.setState({ anchors: anchors }, () => {
      this.setProviderValue();
    });
  }
  async updateImages(data) {
    const anchors = await getAnchors(data);
    this.setState({ anchors: anchors }, () => {
      this.setProviderValue();
    });
  }
  //#region: Node Registration and Triggering
  registeredNodes = {};
  async getNodesFromLocation(x, y) {
    const out = await doTap(x, y);
    return out;
  }
  async triggerAtLocation(prop, x, y) {
    const out = await this.getNodesFromLocation(x, y);
    if (out.nodes && out.nodes.length) {
      this.triggerProp(out.nodes[0], prop);
    }
  }
  triggerProp(nodeID, propName) {
    const node = this.registeredNodes[nodeID];
    if (
      node &&
      node.props &&
      node.props[propName] &&
      typeof node.props[propName] == "function"
    ) {
      node.props[propName]();
    }
  }
  registerNode(id, node) {
    this.registeredNodes[id] = node;
  }
  removeNode(id) {
    delete this.registeredNodes[id];
  }
  //#endregion
}
RHDARWrapper.propTypes = {
  planeDetection: PropTypes.bool,
  imageDetection: PropTypes.bool
};
export { RHDARWrapper, RHDARConsumer };
export default RHDARWrapper;
