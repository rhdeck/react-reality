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
    await setAnimation(this.props.seconds, this.props.easing);
  }
  async didNativeUpdate() {
    //Do nothing
  }
}
RHDAnimated.defaultProps = {
  seconds: 1,
  easing: "inout"
};
RHDAnimated.propTypes = {
  seconds: PropTypes.number,
  easing: PropTypes.string
};
export { RHDAnimated, Consumer as RHDAnimatedConsumer };
export default RHDAnimated;
