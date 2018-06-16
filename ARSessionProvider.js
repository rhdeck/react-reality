import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import { clear, pause, resume, setWorldTracking } from "./ARSceneManager";
const { Provider, Consumer: ARSessionConsumer } = createContext({});
class ARSessionProvider extends Component {
  state = {
    providerValue: this.setProviderValue(true),
    alignment: "gravity",
    isStarted: false
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
      isStarted: !!(this.state && this.state.isStarted),
      start: this.start.bind(this),
      stop: this.stop.bind(this)
    };
    if (!skipState) this.setState({ providerValue });
    return providerValue;
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    var ret = prevState;
    if (nextProps.alignment && nextProps.alignment != prevState.alignment) {
      if (prevState.isStarted) {
        ret.alignment = nextProps.alignment;
        setWorldTracking(ret.alignment);
      }
    }
    return ret;
  }
  render() {
    return (
      <Provider value={this.state.providerValue}>
        {typeof this.props.children == "function" ? (
          <ARSessionConsumer>{this.props.children}</ARSessionConsumer>
        ) : (
          this.props.children
        )}
      </Provider>
    );
  }
}
ARSessionProvider.propTypes = {
  alignment: PropTypes.string
};
ARSessionProvider.defaultProps = {
  alignment: "gravity"
};
export { ARSessionProvider, ARSessionConsumer };
export default ARSessionProvider;
