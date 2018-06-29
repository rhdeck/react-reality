import React, { Component, createContext } from "react";
import {
  getPOV,
  stopDetectPositionChange,
  detectPositionChange,
  setPOVSensitivity
} from "./ARSceneManager";
import { setPOVOrientationSensitivity } from "./RNSwiftBridge";
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
    positionSensitivity: -1,
    orientationSensitivity: -1
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
    if (prevState.positionSensitivity != nextProps.positionSensitivity) {
      setPOVSensitivity(nextProps.positionSensitivity);
      ret.positionSensitivity = nextProps.positionSensitivity;
    }
    if (prevState.orientationSensitivity != nextProps.orientationSensitivity) {
      setPOVOrientationSensitivity(nextProps.orientationSensitivity);
      ret.orientationSensitivity = nextProps.orientationSensitivity;
    }
    return ret;
  }
}
ARPositionProvider.defaultProps = {
  positionSensitivity: 0.01,
  orientationSensitivity: 0.05
};
ARPositionProvider.propTypes = {
  onPositionChange: PropTypes.func,
  positionSensitivity: PropTypes.number,
  orientationSensitivity: PropTypes.number
};
export { ARPositionProvider, ARPositionConsumer };
export default ARPositionProvider;
