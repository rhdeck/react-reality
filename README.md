# react-reality

A React-based, JSX-centric way of interacting with Augmented Reality. Make the world your provider.

## Key Features

- Primitives to give high control over every aspect. Makes animations so much easier to have nodes not attached to geometries
- Layout Animations via <ARAnimatedProvider />
- Provider-based (render prop!) tracking of self <ARTrackingProvider />, screen-touch on <ARTouchableMonoView /> and both images and planes via <ARTrackingProvider />
- Support for touch events at the node level via onPress, onPressIn, and onPressOut events. Registered only if using a touchablemonoview
- Support for mixing in scenes and models. Import Scenekit-compatible SCN and DAE via <ARScene /> and add models (like from Google Poly) via <ARModel />.

Currently IOS-Only, but SceneForm may change that!

## Installation

```
yarn add \
  rhdeck/react-reality \
  react-native-swift \
  react-native-pod
yarn link
```

Since ARKit development requires iOS 11, the camera, and signing privileges to get onto device, I also recommend:

```
yarn add \
  react-native-fix-ios-version \
  react-native-camera-ios-enable \
  react-native-setdevteam
react-native setdevteam
react-native link
```

Sample/Template package deployed as RN Template TK

# Reference

## Views

### ARMonoView

### ARTouchableMonoView

## Providers

### ARSessionProvider

### ARPositionProvider

### ARTouchProvider

### ARTrackingProvider

### ARAnimatedProvider

## Consumers

### ARTrackingConsumer

## Nodes

### ARNode

## Geometries

Geometries are generally simple shapes that can be attached to nodes. Only one geometry per node.

### ARBox

### ARCapsule

### ARCylinder

### ARPlane

### ARPyramid

### ARShape

### ARSphere

### ARText

### ARTorus

### ARTube

## Models

### ARScene

### ARModel

## Materials

### ARMaterial

### ARMaterials

An affordance that applies all the ARMaterialProperty child components to every face of the material. (so you can make a red cube without having to specify each side)

````jsx
<ARBox height={1} width={1} length={1}>
  <ARMaterials>
    <ARMaterialProperty id="diffuse" color="red'
  </ARMaterials>
</ARBox>

### ARMaterialProperty

## Sprites

### ARSKScene

### ARSKLabel

# Sample

```jsx
import React, { Component, Children } from "react";
import { AppRegistry, View, Text, processColor } from "react-native";
import {
  ARTouchableMonoView,
  ARPlane,
  ARNode,
  ARBox,
  ARMaterial,
  ARMaterials,
  ARMaterialProperty,
  ARText
} from "react-reality";
export default class ARTest extends Component {
  state = {
    showPreview: true,
    fatColor: "blue",
    tallColor: "purple"
  };
  render() {
    return (
      <ARTouchableMonoView style={{ flex: 1 }} debug>
        <ARNode
          position={{ x: 1, y: 1, z: -5 }}
          onPressIn={() => {
            this.setState({ fatColor: "green" });
          }}
          onPressOut={() => {
            this.setState({ fatColor: "blue" });
          }}
        >
          <ARBox width={2} height={0.5} length={2} chamfer={0}>
            <ARMaterials roughness={0.5} metalness={0.2}>
              <ARMaterialProperty
                id="diffuse"
                color={processColor(this.state.fatColor)}
              />
            </ARMaterials>
          </ARBox>
          <ARNode
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
            <ARBox width={0.5} height={2} length={0.5} chamfer={0}>
              <ARMaterial index={0}>
                <ARMaterialProperty
                  id="diffuse"
                  color={processColor(this.state.tallColor)}
                />
              </ARMaterial>
              <ARMaterial index={1}>
                <ARMaterialProperty
                  id="diffuse"
                  color={processColor(this.state.tallColor)}
                />
              </ARMaterial>
              <ARMaterial index={2}>
                <ARMaterialProperty
                  id="diffuse"
                  color={processColor("green")}
                />
              </ARMaterial>
              <ARMaterial index={3}>
                <ARMaterialProperty
                  id="diffuse"
                  color={processColor("green")}
                />
              </ARMaterial>
              <ARMaterial index={4}>
                <ARMaterialProperty id="diffuse" color={processColor("red")} />
              </ARMaterial>
              <ARMaterial index={5}>
                <ARMaterialProperty id="diffuse" color={processColor("red")} />
              </ARMaterial>
            </ARBox>
            <ARNode position={{ x: 1, y: 1, z: 1 }}>
              <ARText text="hello" font={{ size: 0.5 }} />
            </ARNode>
          </ARNode>
        </ARNode>
      </ARTouchableMonoView>
    );
  }
}
````

# Important Credit-Where-Credit-Is-Due Note

The idea for this package was as a Swift port of [react-native-arkit](https://github.com/HippoAR/react-native-arkit), a cool project written in Objective-C, which is not a cool language. Major props to @macrozone for a heck of a lot of work.

Also the headset view uses ideas from [iOS-ARKit-Headset-View](https://github.com/hanleyweng/iOS-ARKit-Headset-View) which is a cool Swift-first project

And of course the best headset is [Holokit](https://holokit.io) from Amber Garage, who gave a talk at ARiA in January that was my inspiration for getting headset view going in the first place!
