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
            onPress={async ({ nativeEvent: { locationX, locationY } }) => {
              value.triggerAtLocation("onPress", locationX, locationY);
            }}
            onPressIn={async ({ nativeEvent: { locationX, locationY } }) => {
              console.log(
                "Running triggeratlocation from onpressin",
                locationX,
                locationY
              );
              value.triggerAtLocation("onPressIn", locationX, locationY);
            }}
            onPressOut={async ({ nativeEvent: { locationX, locationY } }) => {
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
