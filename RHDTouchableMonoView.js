import { TouchableWithoutFeedback } from "react-native";
import React, { Component } from "react";
import RHDMonoView from "./RHDMonoView";
import { RHDTouchProvider } from "./RHDTouchProvider";
const RHDTouchableMonoView = props => {
  return (
    <RHDTouchProvider>
      {({ triggerAtLocation }) => {
        return (
          <TouchableWithoutFeedback
            onPress={({ nativeEvent: { locationX, locationY } }) => {
              if (triggerAtLocation)
                triggerAtLocation("onPress", locationX, locationY);
            }}
            onPressIn={({ nativeEvent: { locationX, locationY } }) => {
              if (triggerAtLocation)
                triggerAtLocation("onPressIn", locationX, locationY);
            }}
            onPressOut={({ nativeEvent: { locationX, locationY } }) => {
              if (triggerAtLocation)
                triggerAtLocation("onPressOut", locationX, locationY);
            }}
          >
            <RHDMonoView {...props} />
          </TouchableWithoutFeedback>
        );
      }}
    </RHDTouchProvider>
  );
};
RHDTouchableMonoView.propTypes = RHDMonoView.propTypes;
export default RHDTouchableMonoView;
