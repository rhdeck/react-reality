import { requireNativeComponent } from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { RHDSessionConsumer } from "./RHDSessionWrapper";
class RHDBasePrimaryView extends Component {
  render() {
    var out = [
      <NativeV {...this.props} children={null} key="RHDPrimaryViewNative" />
    ];
    if (this.props.children)
      out.push(
        <RHDSessionConsumer key="RHDPrimaryViewConsumer">
          {this.props.children}
        </RHDSessionConsumer>
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
    <RHDSessionConsumer>
      {({ start, stop }) => {
        return <RHDBasePrimaryView {...props} start={start} stop={stop} />;
      }}
    </RHDSessionConsumer>
  );
};
RHDPrimaryView.propTypes = { ...RHDBasePrimaryView.propTypes };
export default RHDPrimaryView;
