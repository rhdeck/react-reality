# react-reality

A React-based, JSX-centric way of interacting with Augmented Reality. Make the world your provider.

Currently IOS-Only, but SceneForm may change that!

## Key Features

- Primitives to give high control over every aspect. Makes animations so much easier to have nodes not attached to geometries
- Layout Animations via `<ARAnimatedProvider />`
- Provider-based (render prop!) tracking of self `<ARPositionProvider />`, screen-touch on `<ARTouchableMonoView />` and both images and planes via `<ARTrackingProvider />`
- Support for touch events at the node level via onPress, onPressIn, and onPressOut events. Registered only if using a touchablemonoview
- Support for mixing in scenes and models. Import Scenekit-compatible SCN and DAE via `<ARScene />` and add models (like from Google Poly) via `<ARModel />`.
- Support for mixing in multiple 2-D SpriteKit `<ARSKScene />` with composed primitives and adding them to an `<ARMaterialProperty>`. A great way for rendering images, video and text(!) in space and performantly.

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
  // ... Nodes that are dependant on where I am...
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
        <ARCapsule />
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

- `anchors`: Key-value pairs of anchors detected with names and relevant information. The key will be the name of the node you can specify as a parentNode for mounting any additional nodes. The value will contain information relevant to the anchor:
  - `type`: `plane` or `image`
  - `plane`: Size of the plane for the identified anchor (be it an image or a detected surface) as {width, height}
    Note that the anchors can and should be referenced as parents to nodes to anchor a node to a particular reference point.
  - `name`: name of the image identified (maps to the key in the images object passed to the `<ARTrackingProvider />`(only provided for image anchors)
  - `alignment`: Whether the detected plane is horizontal or vertical. This informs what orientation change you might want to apply to mounted nodes. (only provided for plane anchors)

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

A node represents position in space relative to their parent. A node need not have anything visible attached to it - in fact, that can be really desirable to manage animations through space, as you set up a node as a reference point and have other nodes position and move in relationship to it.

### ARNode

Position in space relative to its identified parent.

#### Props

- `parentNode`: Node to be parent to this node in space. If not provided, assumes the nearest ancestor `<ARNode />`. If there is none, mounts relative to egocentric origin. (Note: this is usually only specified when you are establishing a node tree that is mounting to an exocentric anchor, like provided by the `<ARTrackingConsumer />`)
- `position`: location of the node in meters relative to its parent. object of {x,y,z} (default: {x: 0, y: 0, z: 0})
- `scale`: resizing this node and its descendants relative to parent node. A positive value where 1.0 means scale is same as parent. (Default: 1.0)
- `opacity`: Whether this node and its descendants should be see-through. Values from 0-1.0 inclusive. 0 means invisible and 1 means opaque. (Default: 1.0)
- `id`: name for the node. Referenced for parentNode publicly. Most of the time you are not setting this. (Default: randomly assigned UUID)

The following all describe the pose of the node. Usually you want to use one but not all three. Orientation is most robust as a quaternion, but rotation and eulerAngles are easier to work with for newcomers.

- `orientation`: pose of the node expressed as a quaternion {x,y,z,w}
- `rotation`: pose of the node expressed with three degrees of freedom {x,y,z}
- `eulerAngles`: pose of the node expressed as euler angles {x,y,z}. (_Hint_ while they can cause rotation lock problems in complex situations, these are easier to use than orientation quaternions for those less versed in 3D programming)

The following props only work when mounted inside a `<ARTouchableMonoView />`:

- `onPress`: event fired with a finger comes down and comes up again over this node on a `<ARTouchableMonoView />`
- `onPressIn`: event fired when finger is pressed on a `<ARTouchableMonoView />` over this node. (usually requires a geometry mounted on this node for detection to work)
- `onPressOut`: event fired when the finger is lifted from a `<ARTouchableMonoView />` over this node. (usually requires a geometry mounted on this node for detection to work)
-

## Geometries

Geometries are generally simple shapes that can be attached to nodes. Only one geometry per node.

_Note_: All size measurements are in meters. Chamfer is the concept of rounding a 3-d corner.

### ARBox

Creates a rectangular hexahedron geometry. C'mon. You know what a box is. Sides: 6

#### Props

- `height`: Height (y-axis) of the box, in meters (default: 1.0)
- `width`: Width (x-axis) of the box, in meters (default: 1.0)
- `length`: Length (z-axis) of the box, in meters (default: 1.0)
- `chamfer`: How much to round the corners of the box (default: 0)

### ARCapsule

A pill shape Sides: 3

#### Props

- `capR`: Radius of the cap on the end of the pill. (default: 0.5)
- `height`: Length of the cap (basically the "tube" part would be height - (capR \* 2) (default: 1)

### ARCone

Cone or a cropped/partial cone. Sides: 2 if it goes to a point, and 3 if it is cropped (e.g. if `topR` and `bottomR` are greater than 0)

#### Props

- `topR`: Radius exposed at top of cone. Set to 0 for the full dunce-hat (Default: 0)
- `bottomR`: Radius at bottom of cone. Set to 0 for an upside-down cone. (Default: 0.5)
- `height`: Height of the cone.

### ARCylinder

A cylinder. Sides: 3

#### Props

- `radius`: radius of the cylinder. (Default: 0.5)
- `height`: length of the cylinder. (Default: 1)

### ARPlane

A single-sided plane. Note that this is invisible from one side. Sides: 1

_Hint_: This is a great geometry for mounting `<ARSKScene />` content

#### Props

- `width`: width of plane. (Default: 1)
- `height`: height of plane. (Default: 1)
- `cornerRadius`: radius of a rounded corner. (Default: 0)

#### Sample

```jsx
<ARPlane>
  <ARMaterials>
    <ARMaterialProperty>
      <ARSKScene width={100} height={100} color="yellow">
        <ARSKLabel text="Hi there" />
      </ARSKScene>
    </ARMaterialProperty>
  </ARMaterials>
</ARPlane>
```

### ARPyramid

A Pyramid. Sides: 5

#### Props

- `width`: x axis of the base. (Default: 1)
- `length`: z axis of the base. (Default: 1)
- `height`: height (y axis) (Default: 1)

### ARShape

A bezier path-based 2D shape defined with SVG and extruded into 3D space. Sides: 1 if there is no extrusion, 3 if there is no chamfer, 4 if chamfer is front or back only, and 5 if there is chamfer both front and back.

This is the most complicated of the basic geometries, and most of the time you won't need to use it anyway, so don't sweat if it looks like a bit much.

#### Props

- `pathSvg`: SVG text representation of the path to be displayed. Required throw error if this text is not provided.
- `extrusion`: depth of the extrusion. (default: 1)
- `chamferMode`: Whether to apply chamfer to front (1), back, (2) both (3) or neither (0). (Default: 0)
- `chamferRadius`: Radius of the chamfer if chamferMode is not 0 (default: 0)

_Note_: Setting a custom bezier path for the chamfer is not supported at this time.

### ARSphere

A ball. Sides: 1

#### Props

- `radius`: Radius of the sphere. (Default: 0.5)

### ARText

Extruded text in space. Sides: 3 if no chamfer, otherwise 4

#### Props

- `text`: Text to be rendered
- `fontName`: Name of font to be used (Defaults to system default font)
- `size`: Size of the font to use (usually effects how geometrically complex the text objects will be) (Default: 12)
- `depth`: z-axis of the extrusion of the text (default: 0.1)
- `chamfer`: chamfer/rounding of the edges from font face to the extrusion (Default: 0)

_Note_: This creates complex shapes that are highly computationally expensive to render and maintain. If you want to display diagetic text, the `<SKLabel />` is higher-quality and lower-cost.

### ARTorus

A donut. Mmm, donuts. Sides: 1

#### Props

- `ringR`: radius of the ring (how wide is the donut sitting on a table?) (Default: 0.5)
- `pipeR`: radius of the pipe itself (how tall is the donut on the table?) (Default: 0.25)

### ARTube

A tube. Sides: 4 if there is any thickness to it (e.g. a difference between `innerR` and `outerR`) , otherwise 2

#### Props

- `innerR`: Radius of the inside of the tube. (Default: 0.25)
- `outerR`: Outer radius of the tube (Default: 0.5)
- `height`: Height/length of the tube. (Default: 1)

_Note_ As implied by the `height` prop, the default position of a tube is vertical. Reorient by changing orentation/rotation/eulerAngles of the containing node.

## Models

Mounting complex models that come from other sources makes developing interesting AR experiences much much easier. Scenes and models get mounted to nodes of interest (such as a detected anchor) and the animations etc just work.

### ARScene

A wrapper for importing pre-build SCN scenes and iOS-compatible DAE ensembles.

_Note_ ARKit seems a little skittish about properly mounting textures for these scenes.

Animate, move it around etc by manipulating a parent node.

Comes with animations running right from the point of mount.

#### Props

- `path`: Local file path to the downloaded SCN or DAE file.

#### Sample

```jsx
<ARNode>
  <ARScene path={localpath_to_scn_file} />
<ARNode>
```

### ARModel

A wrapper for downloaded OBJ models, such as those you can get from Google Poly. Note that it will load textures for a downloaded model from the path relative to that model, whihc means if you get the OBJ and MTL file in the same directory, you probably get all your texture goodness without further work.

#### Props

- `path`: Local file path to the downloaded OBJ file.

#### Sample

```jsx
<ARNode>
  <ARModel path={localpath_to_obj_file} />
</ARNode>
```

## Materials

### ARMaterial

Control over the material applied to a side of a geometry. Directly calling this element is going to be much less common than just using `<ARMaterials />` for simple application to relevant sides.

#### Props

- `index`: the index number of the side of the geometry that this material will apply to.

The rest of these props are for more advanced/subtle manipulation. Most of your control is in the `<ARMaterialProperty />` component.

- `metalness`: Number 0-1
- `roughness`: Number 0-1
- `blendMode`: "Add", "Subtract", "Multiply", "Screen", "Replace"
- `lightingModel`: "Constant", "Blinn", "Phong", "Lambert", "PhysicallyBased"
- `shaders`: Object {Geometry, Surface, LightingModel, Fragment}
- `writesToDepthBuffer`: Boolean
- `colorBufferWriteMask`: "All", "None", "Alpha", "Blue", "Red", "Green
- `doubleSided`: Boolean
- `litPerPixel`: Boolean
- `transparency`: 0-1
- `fillMode`: "Fill" or "Lines"

**@TODO** fill in smarter descriptions of these

### ARMaterials

An affordance that applies all the ARMaterialProperty child components to every face of the material. (so you can make a red cube without having to specify each side)

#### Props

Inherits all props from `<ARMaterial />` except for `index`.

#### Sample

```xml
<ARBox>
  <ARMaterials>
    <ARMaterialProperty color="red" />
  </ARMaterials>
</ARBox>
```

### ARMaterialProperty

Material Properties define how a material interacts with light. The most common use is setting a color that will cause it to refract that spectrum. A second common use is setting an image that will be used as texture (e.g. a poster of an image).

`<ARMatierialProperty />` nodes are also where you mount your `<ARSKScene>` for placing dynamic 2-d content

#### Props

- `id`: Type of material property. Valid string values include "diffuse", "specular", "normal" (Default, because this is the one you will want to use most often: **diffuse**)
- `color`: Color to be applied. Takes a string or a number
- `path`: Path to file with texture to apply, as an alternative to setting a flat color
- `intensity`: How much to apply this property (basically lower values wash out the effect/color/texture) 0.0-1.0

#### Sample

```xml
<ARBox>
  <ARMaterials>
    <ARMaterialProperty color="blue"/>
  </ARMaterials>
<ARBox>
```

## 2-D Content

Mounting 2-D content on 3-D objects in space creates cool effects for far less compuational cost, making a smoother experience.

Note all dimensions here are in pixels - the scene is stretched or compressed based on the size of the face of geometry (e.g. the `<ARPlane />` it is mounted on.

### ARSKScene

Wrapper for a 2-D scene that uses SpriteKit technology on iOS.

Must be mounted to a `<ARMaterialProperty />` See sample.

#### Props

- `height`: Pixel height of the SKScene. NOte that this is scaled/stretched based on the geometry this is mounted on. A small "height" on a huge plane will look fuzzy. A big "height" on a tiny plane will look sharp,but be more computational intensive than is really visible.
- `width`: Pixel width of SKScene
- `color`: Background color of the scene

#### Sample

```jsx
<ARNode>
  <ARPlane>
    <ARMaterials>
      <ARMaterialProperty>
        <ARSKScene color="yellow">
          <ARSKLabel text="hi there" />
        </ARSKScene>
      </ARMaterialProperty>
    </ARMaterials>
  </ARPlane>
</ARNode>
```

### ARSKLabel

A text label to be rendered in a `<ARSKScene />`.

#### Props

- `text`: Text to be rendered as a string
- `position`: Offset of top-left from parent SK element {x, y}
- `fontName`: Font to use (Default: system default)
- `fontSize`: Size of font to use. Number, not string. (Default: system default)
- `fontColor`: Color to draw with
- `width`: Pixel width to allocate to the text (will wrap within this pixel constraint)

#### Sample

```jsx
<ARNode>
  <ARPlane>
    <ARMaterials>
      <ARMaterialProperty>
        <ARSKScene color="yellow">
          <ARSKLabel text="hi there" fontColor="purple" fontSize={25} />
        </ARSKScene>
      </ARMaterialProperty>
    </ARMaterials>
  </ARPlane>
</ARNode>
```

# App.js sample

```jsx
import React, { Component } from "react";
import {
  ARTouchableMonoView,
  ARNode,
  ARBox,
  ARMaterial,
  ARMaterials,
  ARMaterialProperty,
  ARText,
  ARSessionProvider
} from "react-reality";
export default class ARTest extends Component {
  state = {
    showPreview: true,
    fatColor: "blue",
    tallColor: "purple"
  };
  render() {
    return (
      <ARSessionProvider>
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
            <ARBox width={2} height={0.5} length={2}>
              <ARMaterials roughness={0.5} metalness={0.2}>
                <ARMaterialProperty id="diffuse" color={this.state.fatColor} />
              </ARMaterials>
            </ARBox>
            <ARNode
              position={{ x: 0.4, y: 3 }}
              eulerAngles={{ x: 0.5, y: 0.2 }}
              onPress={() => {
                this.setState(({ tallColor }) => {
                  return {
                    tallColor: tallColor == "yellow" ? "purple" : "yellow"
                  };
                });
              }}
            >
              <ARBox width={0.5} height={2} length={0.5}>
                <ARMaterial index={0}>
                  <ARMaterialProperty
                    id="diffuse"
                    color={this.state.tallColor}
                  />
                </ARMaterial>
                <ARMaterial index={1}>
                  <ARMaterialProperty
                    id="diffuse"
                    color={this.state.tallColor}
                  />
                </ARMaterial>
                <ARMaterial index={2}>
                  <ARMaterialProperty id="diffuse" color={"green"} />
                </ARMaterial>
                <ARMaterial index={3}>
                  <ARMaterialProperty id="diffuse" color={"green"} />
                </ARMaterial>
                <ARMaterial index={4}>
                  <ARMaterialProperty id="diffuse" color={"red"} />
                </ARMaterial>
                <ARMaterial index={5}>
                  <ARMaterialProperty id="diffuse" color={"red"} />
                </ARMaterial>
              </ARBox>
              <ARNode position={{ x: 1, y: 1, z: 1 }}>
                <ARText text="hello" />
              </ARNode>
            </ARNode>
          </ARNode>
        </ARTouchableMonoView>
      </ARSessionProvider>
    );
  }
}
```

# Credit-Where-Credit-Is-Due

The idea for this package was as a Swift port of [react-native-arkit](https://github.com/react-native-ar/react-native-arkit), a cool project written in Objective-C, which is not a cool language. Major props to @macrozone for a heck of a lot of work.
