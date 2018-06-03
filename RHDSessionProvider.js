import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import { clear, pause, resume, setWorldTracking } from "./RHDSceneManager";
const { Provider, Consumer: RHDSessionConsumer } = createContext();
class RHDSessionProvider extends Component {
  state = {
    providerValue: this.setProviderValue(true),
    alignment: "gravity"
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
  static setDerivedStateFromProps(nextProps, prevState) {
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
          <RHDSessionConsumer>{this.props.children}</RHDSessionConsumer>
        ) : (
          this.props.children
        )}
      </Provider>
    );
  }
}
RHDSessionProvider.propTypes = {
  alignment: PropTypes.string
};
export { RHDSessionProvider, RHDSessionConsumer };
export default RHDSessionProvider;
