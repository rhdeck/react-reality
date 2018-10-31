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

## 15-second installation: `react-reality-cli`

```bash
yarn global add rhdeck/react-reality-cli # or npm i g react-reality-cli
react-reality init myreality # of course, replace myreality with your preferred name
cd myreality
react-reality run-ios --device # react-reality acts like react-native inside a RR/RN project
code .
```

_Note_ This installer utilizes [react-native-setdevteam](https://npmjs.com/package/react-native-setdevteam). If you have not used it before, it will ask you either to input your developer team ID or to give permission to find it for you in another project. This is necessary to sign your app and test on the phone.

_Another Note_ This installer utilizes [react-native-bundlebase](https://npmjs.com/pacakge/react-native-bundlebase). If you have not used this package before, it will ask you for the base name you want to use for your app bundles. Your bundle then becomes [projectname].[bundle base]. This maintains uniqueness that allows you to more easily deploy to your device.

Happy AR coding.

## 1-minute Installation: `react-native link`

```
react-native init myreality
cd myreality
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

Copy the sample code at the bottom of this file to your App.js to try it out. But the `react-reality-cli` approach is a lot cleaner.

## Extensions

- [`react-reality-cli`](https://github.com/rhdeck/react-reality-cli): Command line interface for rapidly spinning up and managing react-reality projects
- [`react-reality-holokit`](https://github.com/rhdeck/react-reality-holokit): Implementation of headset view to use the holokit by Amber Garage
- [`react-reality-rnarkit-bridge`](https://github.com/rhdeck/react-reality-rnarkit-bridge): Implementing the `react-native-arkit` API on top of the `react-reality` framework.

# Reference

## Views

### ARMonoView

A "magic glass" renderer of both the real and virtual space from your point of view.

Will auto-create a `<ARSessionProvider />` if it is not already the child of one.

#### Props

If implemented without a wrapping `<ARSessionProvider />` it takes the props of `<ARSessionProvider />` most importantly `alignment`.

Otherwise, it's a View. No special (public) props.

#### Sample

```javascript
  <ARMonoView alignment="compass">
    <ARNode ... />
  </ARMonoView>
```

### ARTouchableMonoView

Like `ARMonoView` but adds touchability, so that descendant nodes can implement touch event handlers.

Will auto-create a `<ARSessionProvider />` if it is not already the child of one.

#### Props

If implemented without a wrapping `<ARSessionProvider />` it takes the props of `<ARSessionProvider />` most importantly `alignment`.

Otherwise, it's a View. No special (public) props.

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

### ARProjectedView

Mount to a node in the 3D space, it will show a view with the origin tied to that point. So if you turn away from that direction it will hide, and otherwise it floats on top where you want it.

_Note_ that it sets the origin and does not clip boundaries, so if you want to "center" on the target point in space, set your "top" and "left" of the view to be negative, as in the sample.

_Also Note_ Any view will show **on top** of virtual 3-d objects, even when the node the view is mounted on is "behind" them. For diagetic fidelity, use a plane mounted in space instead, such as the `<ARSign />` from `react-reality-components`

#### Props

- `parentNode`: ID of the node to which it should attach. Note that just putting the component as child/descendant of an `<ARNode />` will take care of this.

#### Sample

```javascript
  <ARNode position={{z: -5}}>
    <ARProjectedView>
      <View style={{height: 100, width: 100, top: -50, left: -50}}>
        <Text>See me over here, but not anywhere else</Text>
      </View>
    </ARProjectedView>
```

## Providers

React Reality is built with React 16.3 contexts implemented as a first-class design pattern. All providers allow you to control how the environment will operate, and by default they include their own consumer if their child is a function.

### ARSessionProvider

Manages the augmented reality session. Note that no nodes are rendered until the session starts.

#### Props

- `alignment`: How the system should think about x/y/z when start up the AR environment. The device will be the origin - the question is whether the other axes are based on:
  - `gravity` in which case y is down-to-up relative to Earth's gravity but x and z are relative to whichever way the phone is pointing at the start of the session,
  - `compass` in which z is south-to-north and x is west-to-east or
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

- `sensitivity`: the required observed change, in meters, in any direction to trigger either the `onPositionChange` prop or a re-fire of the `<ARPositionConsumer />` render prop. (Default: 0.01 - one centimeter)
- `onPositionChange`: fires every time the position changes by more the designated sensitivity. Contains one argument with a `position` object (x,y,z) and an `orientation` (x,y,z,w)

#### Sample

```javascript
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
- `images`: Object as key-value store of the name of the image you want to hear about, and the an object with members `{url, width}`. `url` is URL to an ordinary image file. `width` is the width of the image in the real world, in meters. (it figures out height from the size ratio of the image itself). Note that this does not require any of the precompiled referenceImage stuff to work - just pass a PNG or something.
- `onUpdateAnchors`: event to fire whenever the provider gets notice of a change, addition or removal of a plane or image, depending on what detection is activated. Basically fires with the same argument and under the same circumstances as the `<ARTrackingConsumer />`.

#### Sample

```javascript
<ARTrackingProvider
  planeDetection="vertical"
  imageDetection={true}
  images={{
    starwars: {
      url: mystarWarsURL,
      width: 0.3
    }
  }}
  onUpdateAnchors={({ anchors }) => {
    console.log("my current anchor list is", anchors);
  }}
/>
```

### ARAnimatedProvider

Layout animations for AR! Declaratively define a transition time for going from one declared layout state to another. Applies to materials, geometries and nodes descending from this node.

_Note_: A good way to set animation at one point but not for other descendants is to implement another intervening `<ARAnimatedProvider />` below it

#### Properties

- `milliseconds` Transition time in ms (Default: 250 - a quarter of a second)
- `easing` Easing acceleration curve. String value with four possibilities:
  - "in": Start slow and speed up in the beginning of the animation. (This usually looks most natural)
  - "out": Go at normal speed but slow down the animation at the end.
  - "both": Start slow, speed up, then slow down at the end.
  - "none": Just move at the same speed the whole time. Has the virtue of being easy to predict where everything will be at any time.
    (Default: "inout")

#### Sample

```javascript
setInterval(()=>{ this.setState({Ypos})=> return { Ypos: Ypos + 1}}, 5000)
...
<ARAnimatedProvider milliseconds={5000}>
  <ARNode
    eulerAngles={{y:this.state.Ypos * Math.PI * 2}}
  >
    <ARBox />
    <ARAnimatedProvider milliseconds={1000} >
      <ARNode
        position={{ x: 4 }}
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

```javascript
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

Consumer for the `<ARTrackingProvider />` above.

#### Argument members

- `anchors`: Key-value pairs of anchors detected with names and relevant information. The key will be the name of the node you can specify as a parentNode for mounting any additional nodes. The value will contain information relevant to the anchor:
  - `type`: "plane" or "image"
  - `plane`: Size of the plane for the identified anchor (be it an image or a detected surface) as {width, height}
    Note that the anchors can and should be referenced as parents to nodes to anchor a node to a particular reference point.
  - `name`: name of the image identified (maps to the key in the images object passed to the `<ARTrackingProvider />`(only provided for image anchors)
  - `alignment`: Whether the detected plane is horizontal or vertical. This informs what orientation change you might want to apply to mounted nodes. (only provided for plane anchors)

#### Sample

```javascript
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

A pill shape. Sides: 3

#### Props

- `capR`: Radius of the cap on the end of the pill. (default: 0.5)
- `height`: Length of the cap (basically the "tube" part would be height - (capR \* 2) (default: 1)

### ARCone

Cone or a cropped/partial cone. Sides: 2 if it goes to a point, and 3 if it is cropped (e.g. if `topR` and `bottomR` are greater than 0)

#### Props

- `topR`: Radius exposed at top of cone. Set to 0 for the full dunce-hat (Default: 0)
- `bottomR`: Radius at bottom of cone. Set to 0 for an upside-down cone. (Default: 0.5)
- `height`: Height of the cone. (Default: 1)

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

```javascript
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

```javascript
<ARNode>
  <ARScene path={localpath_to_scn_file} />
<ARNode>
```

### ARModel

A wrapper for downloaded OBJ models, such as those you can get from Google Poly. Note that it will load textures for a downloaded model from the path relative to that model, whihc means if you get the OBJ and MTL file in the same directory, you probably get all your texture goodness without further work.

#### Props

- `path`: Local file path to the downloaded OBJ file.

#### Sample

```javascript
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

```javascript
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
- `position`: Offset of the center of the text box from parent SK element {x, y}
- `fontName`: Font to use (Default: system default)
- `fontSize`: Size of font to use. Number, not string. (Default: system default)
- `fontColor`: Color to draw with
- `width`: Pixel width to allocate to the text (will wrap within this pixel constraint)
- `lines`: Number of lines to display in the text label (default: 1)
- `lineBreak`: How to handle wrapping between lines. One of `word`, `ellipsis`, `char`. (Default: `word` for multiple-line labels and `ellipsis` when it is one line)
- `allowScaling`: Whether to allow the text to scale when it is too big for the space. Basically means you can apply an arbitrarily big `fontSize` and have it fit. Boolean. (Default: true)

#### Sample

```javascript
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

### ARSKVideo

Play a local video. Rendered in a `<ARSKScene />`. Not super-powerful as yet, but cool to have floating TV effect!

#### Props

- `url`: Source of the video or stream
- `path`: Path to a locally stored video (handy if managing with RNFS) (overridden by `url` if the other is specified)
- `isPlaying` whether the video should be playing or not
- `height` target height of the video in pixels
- `width` target width of the video
- `position` Offset of the center of the vide from the parent SK element {x, y}

#### Sample

```javascript
<ARNode>
  <ARPlane>
    <ARMaterials>
      <ARMaterialProperty>
        <ARSKScene color="yellow">
          <ARSKVideo
            path={"local/path/to/my/video"}
            isPlaying={true}
            height={1080}
            width={1920}
          />
        </ARSKScene>
      </ARMaterialProperty>
    </ARMaterials>
  </ARPlane>
</ARNode>
```

# 2-D Enhancements

## ARButton

Quickly create a 2-d tappable button floating in space. It is a node, but is best mounted on a node with a bit of distance to the user. Requires viewing through `<ARTouchableMonoView />` - otherwise how would you tap it?

### Props

Inherits props from `<ARSign />` and adds:

- `title`: Title text for the button
- `pressDepth`: How much to change z-position when pressed. (negative for "press-in") (Default -0.2 meters)
- `highlightColor`: Color to change to when pressed. (default: purple)

## ARSign

Quickly create a 2-d sign with text floating in space. Acts as a geometry. (E.g. you mount it on a node)

### Props

Inherits props from `<ARPlaneScene />` and adds
`text`: The text to display

### Example

```jsx
<ARNode>
  <ARSign text="Hi there everybody" />
</ARNode>
```

**Note** An even higher-level implementation that smushes the node props in is available as `<ARSignNode />`

## ARPlaneScene

A more generalized implementation that mounts an `<ARSKScene />` on a `<ARPlane />` to speed up generation of 2-D content floating in space. Acts as a geometry.

### Props

Inherits from `<ARPlane />` and `<ARSKScene />` and adds
`ppm`: The pixels-per-meter (roughly DPI x 38) to define detail level of your sign.

**Note** An even higher-level implementation that smushes the node props in is available as `<ARPlaneSceneNode />`

## ARCenteredSKLabel

Creates a text label with horizontal and vertical centering.

### Props

Other props inherited from `<ARSKLabel />`

### Example

```jsx
<ARNode>
<ARPlaneScene>
  <ARCenteredSKLabel width={10 * 38} height={10*38} text="Hi there everybody" />
</ARPlaneScene>
```

# Enhanced Geometries

## Colored Geometries

These components apply a `color` prop to the diffuse property of all sides of the geometry.

- ARColoredBox
- ARColoredCapsule
- ARColoredCone
- ARColoredCapsule
- ARColoredPlane
- ARColoredPyramid
- ARColoredShape
- ARColoredSphere
- ARColoredText
- ARColoredTorus
- ARColoredTube

## Textured Geometries

These components apply a `path` prop containing a path to a locally saved texture to all sides of the geometry.

- ARTexturedBox
- ARTexturedCapsule
- ARTexturedCone
- ARTexturedCapsule
- ARTexturedPlane
- ARTexturedPyramid
- ARTexturedShape
- ARTexturedSphere
- ARTexturedText
- ARTexturedTorus
- ARTexturedTube

# Enhanced Nodes

## Basic Geometry-Node Combinations

The following components smush the properties of the node with the properties of the geometry. Materials can be applied as children.

- ARBoxNode
- ARCapsuleNode
- ARConeNode
- ARCapsuleNode
- ARPlaneNode
- ARPyramidNode
- ARShapeNode
- ARSphereNode
- ARTextNode
- ARTorusNode
- ARTubeNode
- ARSignNode
- ARPlaneSceneNode

## Colored Geometry-Node Combinations

The following smush the properties of the node together with the properties of the geometry and add a prop `color` to trigger the diffuse color of the geometry across all surfaces. No material components need to be added.

- ARColoredBoxNode
- ARColoredCapsuleNode
- ARColoredConeNode
- ARColoredCapsuleNode
- ARColoredPlaneNode
- ARColoredPyramidNode
- ARColoredShapeNode
- ARColoredSphereNode
- ARColoredTextNode
- ARColoredTorusNode
- ARColoredTubeNode

## Textured Geometry-Node Combinations

The following components smush the props of the node and the geometry but allo add a prop `path` to a path texture to be used as the diffuse material. No material components need to be added

- ARTexturedBoxNode
- ARTexturedCapsuleNode
- ARTexturedConeNode
- ARTexturedCapsuleNode
- ARTexturedPlaneNode
- ARTexturedPyramidNode
- ARTexturedShapeNode
- ARTexturedSphereNode
- ARTexturedTextNode
- ARTexturedTorusNode
- ARTexturedTubeNode

## ARMeNode

Component that represents current user position. Implements the details of a `<ARPositionProvider />` so you don't have to.

# Enhanced Materials

## ARColor

Higher-order component to apply a `color` prop as the material to the geometry you are attaching to.

```jsx
<ARBox>
  <ARColor color="red" />
</ARBox>
```

If prop `index` is specified, the color is applied only to that face of the geometry.

```jsx
<ARBox>
  <ARColor index={0} color="red" />
  <ARColor index={1} color="blue" />
  <ARColor index={2} color="red" />
  <ARColor index={3} color="blue" />
  <ARColor index={4} color="red" />
  <ARColor index={5} color="blue" />
</ARBox>
```

## ARTexture

Higher-order component to apply a `path` prop as the path to the texture image for the geometry you are attaching to.

```jsx
<ARBox>
  <ARTexture path={mytexturepath} />
</ARBox>
```

If prop `index` is specified, the texture is applied only to that face of the geometry.

```jsx
<ARBox>
  <ARColor index={0} color="red" />
  <ARTexture index={1} path={mytexturepath} />
  <ARColor index={2} color="red" />
  <ARTexture index={3} path={mytexturepath} />
  <ARColor index={4} color="red" />
  <ARTexture index={5} path={mytexturepath} />
</ARBox>
```

# Enhanced Context Providers

## ARNoSession

Component whose children are displayed when the AR session is not spun up yet. Use for placeholder views.

## ARIsSession

Component whose chidren are displayed when the AR sesison is loaded

## ARNoTracking

Component that shows children when you have no planes or images are detected. Requires `<ARTrackingProvider />` ancestor in tree

## ARIsTracking

Component that shows only when at least one plane or image detecrted. Requires `<ARTrackingProvider />` ancestor in tree

# App.js sample

```javascript
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
                  <ARMaterialProperty id="diffuse" color="green" />
                </ARMaterial>
                <ARMaterial index={3}>
                  <ARMaterialProperty id="diffuse" color="green" />
                </ARMaterial>
                <ARMaterial index={4}>
                  <ARMaterialProperty id="diffuse" color="red" />
                </ARMaterial>
                <ARMaterial index={5}>
                  <ARMaterialProperty id="diffuse" color="red" />
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
