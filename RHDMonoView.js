import { requireNativeComponent } from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { RHDARConsumer } from "./RHDARWrapper";
class RHDMonoView extends Component {
  render() {
    const native = <NativeMV {...this.props} children={null} />;
    if (typeof this.props.children == "function")
      return [native, <RHDARConsumer>{this.props.children}</RHDARConsumer>];
    else return [native, this.props.children];
  }
}
RHDMonoView.propTypes = {
  preview: PropTypes.bool
};
const NativeMV = requireNativeComponent("RHDMonoView", RHDMonoView);
export default RHDMonoView;
