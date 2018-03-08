import { NativeModules, requireNativeComponent } from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { position, transition } from "./components/lib/propTypes";
const RHDSceneManager = NativeModules.RHDSceneManager;
const TRACKING_STATES = ["NOT_AVAILABLE", "LIMITED", "NORMAL"];
const TRACKING_STATES_COLOR = ["red", "orange", "green"];
const TRACKING_REASONS = [
  "NONE",
  "INITIALIZING",
  "EXCESSIVE_MOTION",
  "INSUFFICIENT_FEATURES"
];
class RHDMonoView extends Component {
  // componentWillMount() {
  //   RHDSceneManager.clear();
  // }
  // componentDidMount() {
  //   RHDSceneManager.resume();
  // }
  componentWillUnmount() {
    RHDSceneManager.pause();
  }
  render() {
    return <NativeMV {...this.props} />;
  }
  _onTrackingState = ({ state, reason, floor }) => {
    if (this.props.onTrackingState) {
      this.props.onTrackingState({
        state: TRACKING_STATES[state] || state,
        reason: TRACKING_REASONS[reason] || reason,
        floor
      });
    }
  };
  _onEvent = event => {
    let eventName = event.nativeEvent.event;
    if (!eventName) {
      return;
    }
    eventName = eventName.charAt(0).toUpperCase() + eventName.slice(1);
    const eventListener = this.props[`on${eventName}`];
    if (eventListener) {
      eventListener(event.nativeEvent);
    }
  };
  callback(name) {
    return event => {
      if (this.props[name]) {
        this.props[name](event.nativeEvent);
      } else if (this[`_${name}`]) {
        this[`_${name}`](event.nativeEvent);
      } else {
        try {
          console.log("No callback for event", name);
        } catch (e) {}
      }
    };
  }
}
// copy all ARKitManager properties to ARKit
Object.keys(RHDSceneManager).forEach(key => {
  RHDMonoView[key] = RHDSceneManager[key];
});
RHDMonoView.propTypes = {
  debug: PropTypes.bool,
  planeDetection: PropTypes.bool,
  origin: PropTypes.shape({
    position,
    transition
  }),
  lightEstimationEnabled: PropTypes.bool,
  autoenablesDefaultLighting: PropTypes.bool,
  worldAlignment: PropTypes.number,
  onARKitError: PropTypes.func,
  onPlaneDetected: PropTypes.func,
  onPlaneRemoved: PropTypes.func,
  onFeaturesDetected: PropTypes.func,
  // onLightEstimation is called rapidly, better poll with
  // ARKit.getCurrentLightEstimation()
  onLightEstimation: PropTypes.func,
  onPlaneUpdate: PropTypes.func,
  onTrackingState: PropTypes.func,
  onTapOnPlaneUsingExtent: PropTypes.func,
  onTapOnPlaneNoExtent: PropTypes.func,
  onEvent: PropTypes.func,
  preview: PropTypes.bool
};
const NativeMV = requireNativeComponent("RHDMonoView", RHDMonoView);
export default RHDMonoView;

/*
    onTapOnPlaneUsingExtent={this.callback("onTapOnPlaneUsingExtent")}
        onTapOnPlaneNoExtent={this.callback("onTapOnPlaneNoExtent")}
        onPlaneDetected={this.callback("onPlaneDetected")}
        onPlaneRemoved={this.callback("onPlaneRemoved")}
        onPlaneUpdate={this.callback("onPlaneUpdate")}
        onTrackingState={this.callback("onTrackingState")}
        onARKitError={this.callback("onARKitError")}
        onEvent={this._onEvent}
*/
