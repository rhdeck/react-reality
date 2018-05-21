import { requireNativeComponent } from "react-native";
import React, { Component } from "react";
class RHDSecondaryView extends Component {
  render() {
    return <NativeV {...this.props} />;
  }
}
RHDSecondaryView.propTypes = {};
const NativeV = requireNativeComponent("RHDSecondaryView", RHDSecondaryView);
export default RHDSecondaryView;
