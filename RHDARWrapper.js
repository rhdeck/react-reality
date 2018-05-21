import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import {
  addPlaneDetection,
  removePlaneDetection,
  clear,
  pause,
  resume,
  getAnchors
} from "./RHDSceneManager";
const { Provider, Consumer: RHDARConsumer } = createContext();
class RHDARWrapper extends Component {
  componentWillMount() {
    clear();
  }
  componentDidMount() {
    resume();
  }
  componentWillUnmount() {
    pause();
  }
  setProviderValue() {
    const providerValue = {
      anchors: this.state.anchors
    };
    this.setState({ providerValue });
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
      setImageDetection(nextProps.imageDetection);
      ret.imageDetection = nextProps.imageDetection;
    }
    s;
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
    if (newValue) addPlaneDetection(this.updatePlanes);
    else removePlaneDetection();
  }
  setImageDetection(newValue) {
    if (newValue) addImageDetection(this.updateImages);
    else removeImageDetection();
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
}
RHDARWrapper.propTypes = {
  planeDetection: PropTypes.bool,
  imageDetection: PropTypes.bool
};
export { RHDARWrapper, RHDARConsumer };
export default RHDARWrapper;
