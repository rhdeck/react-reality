# react-native-arkit-swift

# MAJOR UPDATE

The previous version of this package was in part a port of [react-native-arkit](https://github.com/HippoAR/react-native-arkit). The structure and surface area have changed completely.

Demo code from new API (Subject to rapid change)

```jsx
import React, { Component, Children } from "react";
import {
  AppRegistry,
  View,
  Text,
  processColor,
  NativeModules
} from "react-native";
import {
  RHDTouchableMonoView,
  RHDPlane,
  RHDNode,
  RHDBox,
  RHDMaterial,
  RHDMaterials,
  RHDMaterialProperty,
  RHDText
} from "react-native-arkit-swift";
export default class ARTest extends Component {
  state = {
    showPreview: true,
    fatColor: "blue",
    tallColor: "purple"
  };
  render() {
    return (
      <RHDTouchableMonoView style={{ flex: 1 }} debug>
        <RHDNode
          position={{ x: 1, y: 1, z: -5 }}
          onPressIn={() => {
            this.setState({ fatColor: "green" });
          }}
          onPressOut={() => {
            this.setState({ fatColor: "blue" });
          }}
        >
          <RHDBox width={2} height={0.5} length={2} chamfer={0}>
            <RHDMaterials roughness={0.5} metalness={0.2}>
              <RHDMaterialProperty
                id="diffuse"
                color={processColor(this.state.fatColor)}
              />
            </RHDMaterials>
          </RHDBox>
          <RHDNode
            position={{ x: 0.4, y: 3, z: 0 }}
            eulerAngles={{ x: 0.5, y: 0.2, z: 0 }}
            onPress={() => {
              this.setState(({ tallColor }) => {
                return {
                  tallColor: tallColor == "yellow" ? "purple" : "yellow"
                };
              });
            }}
          >
            <RHDBox width={0.5} height={2} length={0.5} chamfer={0}>
              <RHDMaterial index={0}>
                <RHDMaterialProperty
                  id="diffuse"
                  color={processColor(this.state.tallColor)}
                />
              </RHDMaterial>
              <RHDMaterial index={1}>
                <RHDMaterialProperty
                  id="diffuse"
                  color={processColor(this.state.tallColor)}
                />
              </RHDMaterial>
              <RHDMaterial index={2}>
                <RHDMaterialProperty
                  id="diffuse"
                  color={processColor("green")}
                />
              </RHDMaterial>
              <RHDMaterial index={3}>
                <RHDMaterialProperty
                  id="diffuse"
                  color={processColor("green")}
                />
              </RHDMaterial>
              <RHDMaterial index={4}>
                <RHDMaterialProperty id="diffuse" color={processColor("red")} />
              </RHDMaterial>
              <RHDMaterial index={5}>
                <RHDMaterialProperty id="diffuse" color={processColor("red")} />
              </RHDMaterial>
            </RHDBox>
            <RHDNode position={{ x: 1, y: 1, z: 1 }}>
              <RHDText text="hello" font={{ size: 0.5 }} />
            </RHDNode>
          </RHDNode>
        </RHDNode>
      </RHDTouchableMonoView>
    );
  }
}
```

# Important Credit-Where-Credit-Is-Due Note

The idea for this package was as a Swift port of [react-native-arkit](https://github.com/HippoAR/react-native-arkit), a cool project written in Objective-C, which is not a cool language. Major props to @macrozone for a heck of a lot of work.

Also the headset view uses ideas from [iOS-ARKit-Headset-View](https://github.com/hanleyweng/iOS-ARKit-Headset-View) which is a cool Swift-first project

And of course the best headset is [Holokit](https://holokit.io) from Amber Garage, who gave a talk at ARiA in January that was my inspiration for getting headset view going in the first place!
