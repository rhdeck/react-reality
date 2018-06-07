import React, { createContext, Component } from "react";
import PropTypes from "prop-types";
import { setAnimation, removeAnimation } from "./ARSceneManager";
const { Provider, Consumer } = createContext({});
class ARAnimatedProvider extends Component {
  providerValue = {
    willNativeUpdate: this.willNativeUpdate.bind(this),
    didNativeUpdate: this.didNativeUpdate.bind(this)
  };
  render() {
    return <Provider {...this.props} value={this.providerValue} />;
  }
  async willNativeUpdate() {
    await setAnimation(
      parseFloat(this.props.milliseconds) / 1000.0,
      this.props.easing
    );
  }
  async didNativeUpdate() {
    //Do nothing
  }
}
ARAnimatedProvider.defaultProps = {
  milliseconds: 250,
  easing: "inout"
};
ARAnimatedProvider.propTypes = {
  milliseconds: PropTypes.number,
  easing: PropTypes.string
};
export { ARAnimatedProvider, Consumer as ARAnimatedConsumer };
export default ARAnimatedProvider;
