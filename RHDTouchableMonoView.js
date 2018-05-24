import { TouchableWithoutFeedback } from "react-native";
import React, { Component } from "react";
import RHDMonoView from "./RHDMonoView";
import RHDNode from "./components/RHDNode";
import { doTap } from "./RHDSceneManager";
import { RHDARConsumer } from "./RHDARWrapper";
const RHDTouchableMonoView = props => {
  return (
    <RHDARConsumer>
      {value => {
        return (
          <TouchableWithoutFeedback
            onPress={({ nativeEvent: { locationX, locationY } }) => {
              value.triggerAtLocation("onPress", locationX, locationY);
            }}
            onPressIn={({ nativeEvent: { locationX, locationY } }) => {
              console.log(
                "Running triggeratlocation from onpressin",
                locationX,
                locationY
              );
              value.triggerAtLocation("onPressIn", locationX, locationY);
            }}
            onPressOut={({ nativeEvent: { locationX, locationY } }) => {
              value.triggerAtLocation("onPressOut", locationX, locationY);
            }}
          >
            <RHDMonoView {...props} />
          </TouchableWithoutFeedback>
        );
      }}
    </RHDARConsumer>
  );
};
RHDTouchableMonoView.propTypes = RHDMonoView.propTypes;
export default RHDTouchableMonoView;
