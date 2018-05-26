import React, { createContext, Component } from "react";
import PropTypes from "prop-types";
import { setAnimation, removeAnimation } from "../RHDSceneManager";
const { Provider, Consumer } = createContext({});
class RHDAnimated extends Component {
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
RHDAnimated.defaultProps = {
  milliseconds: 250,
  easing: "inout"
};
RHDAnimated.propTypes = {
  milliseconds: PropTypes.number,
  easing: PropTypes.string
};
export { RHDAnimated, Consumer as RHDAnimatedConsumer };
export default RHDAnimated;
