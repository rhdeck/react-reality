import { requireNativeComponent } from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { RHDARConsumer } from "./RHDARWrapper";
class RHDBasePrimaryView extends Component {
  render() {
    var out = [
      <NativeV {...this.props} children={null} key="RHDPrimaryViewNative" />
    ];
    if (this.props.children)
      out.push(
        <RHDARConsumer key="RHDPrimaryViewConsumer">
          {this.props.children}
        </RHDARConsumer>
      );
    return out;
  }
}
RHDBasePrimaryView.propTypes = {
  interPupilaryDistance: PropTypes.number,
  start: PropTypes.func,
  stop: PropTypes.func
};
const NativeV = requireNativeComponent("RHDPrimaryView", RHDBasePrimaryView);

const RHDPrimaryView = props => {
  return (
    <RHDARConsumer>
      {value => {
        return (
          <RHDBasePrimaryView
            {...props}
            start={value.start}
            stop={value.stop}
          />
        );
      }}
    </RHDARConsumer>
  );
};
RHDPrimaryView.propTypes = { ...RHDBasePrimaryView.propTypes };
export default RHDPrimaryView;
