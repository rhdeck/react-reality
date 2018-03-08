import { NativeModules, requireNativeComponent } from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";

import { position, transition } from "./components/lib/propTypes";
const RHDSceneManager = NativeModules.RHDSceneManager;
class RHDPrimaryView extends Component {
  render() {
    return <NativeV {...this.props} />;
  }
  componentWillUnmount() {
    RHDSceneManager.pause();
  }
}

Object.keys(RHDSceneManager).forEach(key => {
  RHDPrimaryView[key] = RHDSceneManager[key];
});
RHDPrimaryView.propTypes = {
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
  onStart: PropTypes.func,
  interPupilaryDistance: PropTypes.number
};
const NativeV = requireNativeComponent("RHDPrimaryView", RHDPrimaryView);

export default RHDPrimaryView;
