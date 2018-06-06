import { View, processColor, Text, SafeAreaView } from "react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import RHDPrimaryView from "./RHDPrimaryView";
import RHDSecondaryView from "./RHDSecondaryView";
const PixelsPerInch = 458;
const pixels = 2436;
const points = 812;
const PixelsPerPoint = pixels / points;
const MetersPerInch = 0.0254;
const MetersPerPixel = MetersPerInch / PixelsPerInch;
const MetersPerPoint = MetersPerPixel * PixelsPerPoint;
const PointsPerMeter = 1 / MetersPerPoint;
const ipd = 0.064;
const doubleWidth = ipd * PointsPerMeter * 2;
console.log("hi there!!!", ipd * PointsPerMeter, PixelsPerPoint, PixelsPerInch);
class RHDDualView extends Component {
  render() {
    return (
      <View
        style={{
          ...this.props.style,
          height: "100%",
          width: "100%",
          backgroundColor: "red",
          alignItems: "center"
        }}
      >
        <View
          style={{
            ...this.props.style,
            flexDirection: "row",
            height: "100%",
            width: doubleWidth
          }}
        >
          <RHDPrimaryView
            {...this.props}
            style={{
              flex: 1
            }}
          />
          <RHDSecondaryView
            style={{
              flex: 1
            }}
          />
        </View>
      </View>
    );
  }
}
RHDDualView.propTypes = {
  ...RHDPrimaryView.propTypes
};
export default RHDDualView;
