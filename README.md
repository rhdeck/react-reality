# react-reality

A React-based, JSX-centric way of interacting with Augmented Reality. Make the world your provider.

## Key Features

- Primitives to give high control over every aspect. Makes animations so much easier to have nodes not attached to geometries
- Layout Animations via <ARAnimatedProvider />
- Provider-based (render prop!) tracking of self <ARTrackingProvider />, screen-touch on <ARTouchableMonoView /> and both images and planes via <ARTrackingProvider />
- Support for touch events at the node level via onPress, onPressIn, and onPressOut events. Registered only if using a touchablemonoview
- Support for mixing in scenes and models. Import Scenekit-compatible SCN and DAE via <ARScene /> and add models (like from Google Poly) via <ARModel />.

Currently IOS-Only, but SceneForm may change that!

## Installation: `react-native link`

```
yarn add \
  rhdeck/react-reality \
  react-native-swift \
  react-native-pod
react-native link
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

## Extensions

- [`react-reality-holokit`](https://github.com/rhdeck/react-reality-holokit): Implementation of headset view to use the holokit by Amber Garage

# Reference

## Views

### ARMonoView

A "magic glass" renderer of both the real and virtual space from your point of view.

Should be instantiated as child of an ARSessionProvider. Spins up a session to display the nodes designated as children/descendants.

#### Sample

```xml
<ARSessionProvider>
  <ARMonoView>
    <ARNode ... />
  </ARMonoView>
</ARSessionProvider>
```

### ARTouchableMonoView

Like `ARMonoView` but adds touchability, so that descendant nodes can implement touch event handlers.

Should be instantiated as child of an ARSessionProvider. Spins up a session to display the nodes designated as children/descendants.

#### Sample

```xml
<ARSessionPropvider>
  <ARTouchableMonoView>
    ...Other nodes rendered
    <ARNode onPress={()=>{console.log("I got pressed"}>
      ...Geometries, etc
    </ARNode>
  </ARTouchableMonoView>
</ARSessionProvider>
```

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

Creates a rectangular hexahedron geometry. C'mon. You know what a box is.

#### Props

- height: Height (y-axis) of the box, in meters (default: 1.0)
- width: Width (x-axis) of the box, in meters (default: 1.0)
- length: Length (z-axis) of the box, in meters (default: 1.0)
- chamfer: How much to round the corners of the box (default: 0)

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

#### Props

None

#### Example

```xml
<ARBox>
  <ARMaterials>
    <ARMaterialProperty color="red" />
  </ARMaterials>
</ARBox>
```

### ARMaterialProperty

#### Props

- id: Type of material property. (Default, because this is the one you will want to use most often: **diffuse**)
- color: Color to be applied. Takes a string or a number
- path: Path to file with texture to apply, as an alternative to setting a flat color
- intensity: How much to apply this property (basically lower washes out the effect/color/texture) 0.0-1.0

```xml
<ARBox>
  <ARMaterials>
    <ARMaterialProperty color="blue"/>
  </ARMaterials>
<ARBox>
```

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
```

# Important Credit-Where-Credit-Is-Due Note

The idea for this package was as a Swift port of [react-native-arkit](https://github.com/HippoAR/react-native-arkit), a cool project written in Objective-C, which is not a cool language. Major props to @macrozone for a heck of a lot of work.
