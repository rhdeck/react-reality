import { requireNativeComponent } from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { ARSessionConsumer, ARSessionProvider } from "./ARSessionProvider";
class ARBaseMonoView extends Component {
  render() {
    return (
      <ARSessionConsumer>
        {value => {
          const { isStarted } = value;
          if (typeof isStarted === "undefined") {
            return (
              <ARSessionProvider
                alignment={
                  this.props.alignment
                    ? this.props.alignment
                    : ARSessionProvider.defaultProps.alignment
                }
              >
                <ARMonoView {...this.props} />
              </ARSessionProvider>
            );
          } else
            return [
              <NativeMV
                {...this.props}
                children={null}
                key="ARMonoViewNative"
              />,
              typeof this.props.children == "function" ? (
                <ARSessionConsumer key="ARMonoViewConsumer">
                  {value => {
                    return this.props.children(value);
                  }}
                </ARSessionConsumer>
              ) : this.props.children ? (
                this.props.children
              ) : null
            ];
        }}
      </ARSessionConsumer>
    );
  }
  componentDidMount() {
    if (typeof this.props.start == "function") this.props.start();
  }
  componentWillUnmount() {
    if (typeof this.props.stop == "function") this.props.stop();
  }
}
ARBaseMonoView.propTypes = {
  preview: PropTypes.bool,
  start: PropTypes.func,
  stop: PropTypes.func
};
const NativeMV = requireNativeComponent("ARMonoView", ARBaseMonoView);

const ARMonoView = props => {
  return (
    <ARSessionConsumer>
      {({ start, stop }) => {
        return <ARBaseMonoView {...props} start={start} stop={stop} />;
      }}
    </ARSessionConsumer>
  );
};

ARMonoView.propTypes = { ...ARBaseMonoView.propTypes };

export default ARMonoView;
