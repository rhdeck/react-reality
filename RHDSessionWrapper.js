import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import { clear, pause, resume } from "./RHDSceneManager";
const { Provider, Consumer: RHDSessionConsumer } = createContext();
class RHDSessionWrapper extends Component {
  state = {
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
          <RHDSessionConsumer>{this.props.children}</RHDSessionConsumer>
        ) : (
          this.props.children
        )}
      </Provider>
    );
  }
}
export { RHDSessionWrapper, RHDSessionConsumer };
export default RHDSessionWrapper;
