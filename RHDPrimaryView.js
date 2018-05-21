import { requireNativeComponent } from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { RHDARConsumer } from "./RHDARWrapper";
class RHDPrimaryView extends Component {
  render() {
    var out = [<NativeV {...this.props} children={null} />];
    if (this.props.children)
      out.push(<RHDARConsumer>{this.props.children}</RHDARConsumer>);
    return out;
  }
}
RHDPrimaryView.propTypes = {
  interPupilaryDistance: PropTypes.number
};
const NativeV = requireNativeComponent("RHDPrimaryView", RHDPrimaryView);
export default RHDPrimaryView;
