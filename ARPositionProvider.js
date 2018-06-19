import React, { Component, createContext } from "react";
import {
  getPOV,
  stopDetectPositionChange,
  detectPositionChange,
  setPOVSensitivity
} from "./ARSceneManager";
import PropTypes from "prop-types";
const { Provider, Consumer: ARPositionConsumer } = createContext({
  position: { x: 0, y: 0, z: 0 },
  orientation: {}
});
class ARPositionProvider extends Component {
  state = {
    providerValue: {
      position: { x: 0, y: 0, z: 0 },
      orientation: { x: 0 }
    },
    sensitivity: 0.01
  };
  componentDidMount() {
    detectPositionChange(this.onPositionChange.bind(this));
  }
  componentWillUnmount() {
    stopDetectPositionChange();
  }
  onPositionChange(data) {
    this.setState({ providerValue: data });
    if (typeof this.props.onPositionChange == "function")
      this.props.onPositionChange(data);
  }
  render() {
    return (
      <Provider value={this.state.providerValue}>
        {typeof this.props.children == "function" ? (
          <ARPositionConsumer>
            {value => {
              return this.props.children(value);
            }}
          </ARPositionConsumer>
        ) : (
          this.props.children
        )}
      </Provider>
    );
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    var ret = prevState;
    if (prevState.sensitivity != nextProps.sensitivity) {
      setPOVSensitivity(nextProps.sensitivity);
      ret.sensitivity = nextProps.sensitivity;
    }
    return ret;
  }
}

ARPositionProvider.defaultProps = {
  sensitivity: 0.01
};
ARPositionProvider.propTypes = {
  onPositionChange: PropTypes.func,
  sensitivity: PropTypes.number
};
export { ARPositionProvider, ARPositionConsumer };
export default ARPositionProvider;
