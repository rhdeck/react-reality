# react-reality

A React-based, JSX-centric way of interacting with Augmented Reality. Make the world your provider.

## Key Features

- Primitives to give high control over every aspect. Makes animations so much easier to have nodes not attached to geometries
- Layout Animations via <ARAnimatedProvider />
- Provider-based (render prop!) tracking of self `<ARTrackingProvider />`, screen-touch on `<ARTouchableMonoView />` and both images and planes via `<ARTrackingProvider />`
- Support for touch events at the node level via onPress, onPressIn, and onPressOut events. Registered only if using a touchablemonoview
- Support for mixing in scenes and models. Import Scenekit-compatible SCN and DAE via `<ARScene />` and add models (like from Google Poly) via `<ARModel />`.
- Support for mixing in multiple 2-D SpriteKit `<ARSKScene />` with composed primitives and adding them to an `<ARMaterialProperty>`. A great way for rendering images, video and text(!) in space and performantly.
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

Should be instantiated as descendant of an ARSessionProvider. Spins up a session to display the nodes designated as children/descendants.

#### Props

It's a View. No special (public) props.

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

Should be instantiated as a descendant of an ARSessionProvider. Spins up a session to display the nodes designated as children/descendants.

#### Props

It's a View. No special props.

#### Sample

```xml
<ARSessionProvider>
  <ARTouchableMonoView>
    ...Other nodes rendered
    <ARNode onPress={()=>{console.log("I got pressed"}>
      ...Geometries, etc
    </ARNode>
  </ARTouchableMonoView>
</ARSessionProvider>
```

## Providers

React Reality is built with React 16.3 contexts implemented as a first-class design pattern. All providers allow you to control how the environment will operate, and by default they include their own consumer if their child is a function.

### ARSessionProvider

Manages the augmented reality session. Note that no nodes are rendered until the session starts.

#### Props

- `alignment`: How the system should think about x/y/z when start up the AR environment. The device will be the origin - the question is whether the other axes are based onL
  - `gravity` in which case y is up/down to Earth's gravity but x and z are relative to whichever way the phone is pointing at the start of the session,
  - `compass` in which z is north/south and x is west/east or
  - `camera` in which they are all based on the orientation of the device itself.
    (Default: `gravity`)

#### Sample

```xml
<ARSessionProvider alignment={compass}>
  {Well-aligned nodes!}
</ARSessionProvider>
```

### ARPositionProvider

Tracks changes in the position of the primary point of view For `<ARMonoView />`, this is just the position of the device itself.

If the immediate child is a function, the provider will wrap it in an `<ARPositionConsumer />` to pass the function those arguments.

#### Props

- `sensitivity`: the required observed change, in meters, in any direction to trigger either the `onPositionChange` prop or a re-fire of the `<ARPositionConsumer />` render prop.
- `onPositionChange`: fires every time the position changes by more the designated sensitivity. Contains one argument with a `position` object (x,y,z) and an `orientation` (x,y,z,w)

#### Sample

```jsx
<ARPositionProvider
  sensitivity={0.05} //Fires with 5cm of movement
  onPositionChange={({ position, orientation }) => {
    console.log("my new lateral position is ", position.x);
  }}
> {({position, orientation})=>{
  // ... Nodes that are depdendant on where I am...
}}
```

### ARTrackingProvider

Detects and tracks planes and images (markers) in space, providing what's found via `<ARTrackingConsumer />`

#### Props

- `planeDetection`: Whether to detect planes and if so what kind., Values: "horizontal", "vertical", "both", "none" (Default: "none")
- `imageDetection`: Whether to detect images defined in the images prop. Note that if there are no images in the images prop, this is not helpful. (Default: false)
- `images`: Object as key-value store of the name of the image you want to hear about, and the file URL to an ordinary image file. (note that this does not require any of the precompiled referenceImage stuff to work - just pass a PNG or something)
- `onUpdateAnchors`: event to fire whenever the provider gets notice of a change, addition or removal of a plane or image, depending on what detection is activated. Basically fires with the same argument and under the same circumstances as the `<ARTrackingConsumer />`.

#### Sample

```jsx
<ARTrackingProvider
  planeDetection= "vertical"
  images = {true}
  imageDetection = {"starwars":
  mystarWarsURL}
  onUpdateAnchors={({anchors})=> {
    console.log("my current anchor list is", anchors);
  }}
/>
```

### ARAnimatedProvider

Layout animations for AR! Declaratively define a transition time for going from one declared layout state to another. Applies to materials, geometries and nodes descending from this node.

_Note_: A good way to set animation at one point but not for other descendants is to implement another intervening `<ARAnimatedProvider />` below it

#### Properties

- `milliseconds` Transition time in ms.
- `easing` Easing acceleration curve. String value with four possibilities:
  - "in": Start slow and speed up in the beginning of the animation. (This usually looks most natural)
  - "out": Go at normal speed but slow down the animation at the end.
  - "both": Start slow, speed up, then slow down at the end.
  - "none": Just move at the same speed the whole time. Has the virtue of being easy to predict where everything will be at any time.
    (Default: "none")

#### Sample

```jsx
setInterval(()=>{ this.setState({Ypos})=> return { Ypos: Ypos + 1}}, 5000)
...
<ARAnimatedProvider milliseconds={5000}>
  <ARNode
    eulerAngles={{y:this.state.Ypos * Math.PI * 2}}
  >
    <ARBox />
    <ARAnimatedProvider milliseconds={1000} >
      <ARNode
        position={{ x: 4}}
        eulerAngles={{x: this.state.Ypos * Math.PI}}>
      >
        <ARCapsule>
      </ARNode>
    </ARAnimatedProvider>
  </ARNode>
<ARAnimatedProvider>
```

## Consumers

### ARPositionConsumer

Context consumer for an ancestor `<ARPositionProvider />`. A good way to wrap the one node you want to act as your buddy.

#### Argument members

- `position`: Location of current POV (relative to initial origin)
- `orientation`: Orientation of current POV in quaternion format (x,y,z,w)

#### Sample

```jsx
<ARPositionProvider>
  // ... intervening generations...
  <ARPositionConsumer>
    {({ position, orientation }) => {
      return (
        <ARNode
          position={{ ...position, z: position.z - 4 }} // Puts the position four meters in front of your current position
          orientation={orientation}
        >
          <ARCapsule />
        </ARNode>
      );
    }}
  </ARPositionConsumer>
</ARPositionProvider>
```

### ARTrackingConsumer

Consumer for the `<ARTrackingProvider />` above. Render prop with the same arguments as the `onUpdateAnchors` prop.

#### Argument members

- `anchors`: Key-value pairs of anchors detected with names and relevant information.

Note that the anchors can and should be referenced as parents to nodes to anchor a node to a particular reference point.

#### Sample

```jsx
<ARTrackingProvider imageDetection={true} images={{starwars: path_to_starwarspng}}>
// ... intervening nodes
  <ARTrackingConsumer>
    {({anchors})=>{
      if(anchors.starwars) {
        //Render a cube two meters above a galaxy far far away
        return (
          <ARNode position = {y: 2} parentNode="starwars">
            <ARBox />
          </ARNode>
        )
      }
    }}
  </ARTrackingConsumer>
</ARTrackingProvider>
```

## Nodes

Nodes represent position in space that are relative to their parent. A node need not have anything visible attached to it - in fact, that can be really desirable to manage animations through space, as you set up a node as a reference point and have other nodes position and move in relationship to it.

### ARNode

Position in space relative to its identified parent.

#### Props

- `position`: location of the node in meters relative to its parent. object of {x,y,z}
- `orientation`: pose of the node expressed as a quaternion {x,y,z,w}
- `eulerAngles`: pose of the node expressed as euler angles {x,y,z}. (_Hint_ these are easier to use for those less versed in 3D programming)
- `onPress`: event fired with a finger comes down and comes up again over this node on a `<ARTouchableMonoView />`
- `onPressIn`: event fired when finger is pressed on a `<ARTouchableMonoView />` over this node. (usually requires a geometry mounted on this node for detection to work)
- `onPressOut`: event fired when the finger is lifted from a `<ARTouchableMonoView />` over this node. (usually requires a geometry mounted on this node for detection to work)

## Geometries

Geometries are generally simple shapes that can be attached to nodes. Only one geometry per node.

_Note_: All size measurements are in meters. Chamfer is the concept of rounding a 3-d corner.

### ARBox

Creates a rectangular hexahedron geometry. C'mon. You know what a box is.

#### Props

- `height`: Height (y-axis) of the box, in meters (default: 1.0)
- `width`: Width (x-axis) of the box, in meters (default: 1.0)
- `length`: Length (z-axis) of the box, in meters (default: 1.0)
- `chamfer`: How much to round the corners of the box (default: 0)

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

# Credit-Where-Credit-Is-Due

The idea for this package was as a Swift port of [react-native-arkit](https://github.com/HippoAR/react-native-arkit), a cool project written in Objective-C, which is not a cool language. Major props to @macrozone for a heck of a lot of work.
