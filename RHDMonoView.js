import { requireNativeComponent } from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { RHDSessionConsumer } from "./RHDSessionWrapper";
class RHDBaseMonoView extends Component {
  render() {
    return [
      <NativeMV {...this.props} children={null} key="RHDMonoViewNative" />,
      typeof this.props.children == "function" ? (
        <RHDSessionConsumer key="RHDMonoViewConsumer">
          {value => {
            return this.props.children(value);
          }}
        </RHDSessionConsumer>
      ) : this.props.children ? (
        this.props.children
      ) : null
    ];
  }
  componentDidMount() {
    if (typeof this.props.start == "function") this.props.start();
  }
  componentWillUnmount() {
    if (typeof this.props.stop == "function") this.props.stop();
  }
}
RHDBaseMonoView.propTypes = {
  preview: PropTypes.bool,
  start: PropTypes.func,
  stop: PropTypes.func
};
const NativeMV = requireNativeComponent("RHDMonoView", RHDBaseMonoView);

const RHDMonoView = props => {
  return (
    <RHDSessionConsumer>
      {({ start, stop }) => {
        return <RHDBaseMonoView {...props} start={start} stop={stop} />;
      }}
    </RHDSessionConsumer>
  );
};

RHDMonoView.propTypes = { ...RHDBaseMonoView.propTypes };

export default RHDMonoView;
