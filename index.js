import ARBox from "./components/ARBox";
import ARCapsule from "./components/ARCapsule";
import ARCone from "./components/ARCone";
import ARCylinder from "./components/ARCylinder";
import ARMonoView from "./ARMonoView";
import ARPlane from "./components/ARPlane";
import ARPyramid from "./components/ARPyramid";
import ARSphere from "./components/ARSphere";
import ARText from "./components/ARText";
import ARTorus from "./components/ARTorus";
import ARTube from "./components/ARTube";
import ARNode from "./components/ARNode";
import ARMaterial from "./components/ARMaterial";
import ARMaterialProperty from "./components/ARMaterialProperty";
import ARMaterials from "./components/ARMaterials";
import ARTouchableMonoView from "./ARTouchableMonoView";
import { ARSKScene, ARSKNodeConsumer } from "./components/ARSKScene";
import ARSKLabel from "./components/ARSKLabel";
import ARAnimatedProvider from "./ARAnimatedProvider";
import ARScene from "./components/ARScene";
import ARModel from "./components/ARModel";
import { ARSessionConsumer, ARSessionProvider } from "./ARSessionProvider";
import { ARPositionProvider, ARPositionConsumer } from "./ARPositionProvider";
import { ARTrackingConsumer, ARTrackingProvider } from "./ARTrackingProvider";
import ARShape from "./components/ARShape";
import ARLight from "./components/ARLight";
import ARSKVideo from "./components/ARSKVideo";
import {
  ARProjectedPointProvider,
  ARProjectedPointConsumer
} from "./components/ARProjectedPointProvider";
import ARProjectedView from "./ARProjectedView";
export {
  ARMonoView,
  ARBox,
  ARSphere,
  ARCylinder,
  ARCone,
  ARPyramid,
  ARTube,
  ARTorus,
  ARCapsule,
  ARPlane,
  ARText,
  ARNode,
  ARMaterial,
  ARMaterialProperty,
  ARMaterials,
  ARTouchableMonoView,
  ARSKScene,
  ARSKLabel,
  ARSessionConsumer,
  ARSessionProvider,
  ARAnimatedProvider,
  ARPositionProvider,
  ARPositionConsumer,
  ARTrackingConsumer,
  ARTrackingProvider,
  ARScene,
  ARModel,
  ARShape,
  ARLight,
  ARSKVideo,
  ARSKNodeConsumer,
  ARProjectedPointConsumer,
  ARProjectedPointProvider,
  ARProjectedView
};
import React, { Component } from "react";
import PropTypes from "prop-types";
//#region Materials
export const ARColor = ({ color, index }) => {
  if (typeof index == "undefined") {
    return (
      <ARMaterials>
        <ARMaterialProperty color={color} />
      </ARMaterials>
    );
  } else {
    return (
      <ARMaterial index={index}>
        <ARMaterialProperty color={color} />
      </ARMaterial>
    );
  }
};
export const ARTexture = ({ path, index }) => {
  if (typeof index == "undefined") {
    return (
      <ARMaterials>
        <ARMaterialProperty path={path} />
      </ARMaterials>
    );
  } else {
    return (
      <ARMaterial>
        <ARMaterialProperty path={path} />
      </ARMaterial>
    );
  }
};
//#endregion
const ARColoredGeometry = G => props => {
  return (
    <G {...props}>
      <ARColor color={props.color} />
    </G>
  );
};
const ARTexturedGeometry = G => props => {
  return (
    <G {...props}>
      <ARTexture path={props.path} />
    </G>
  );
};
//#region Geometries
export const ARColoredBox = ARColoredGeometry(ARBox);
export const ARColoredCylinder = ARColoredGeometry(ARCylinder);
export const ARColoredCone = ARColoredGeometry(ARCone);
export const ARColoredCapsule = ARColoredGeometry(ARCapsule);
export const ARColoredPlane = ARColoredGeometry(ARPlane);
export const ARColoredPyramid = ARColoredGeometry(ARPyramid);
export const ARColoredShape = ARColoredGeometry(ARShape);
export const ARColoredSphere = ARColoredGeometry(ARSphere);
export const ARColoredText = ARColoredGeometry(ARText);
export const ARColoredTorus = ARColoredGeometry(ARTorus);
export const ARColoredTube = ARColoredGeometry(ARTube);

export const ARTexturedBox = ARTexturedGeometry(ARBox);
export const ARTexturedCylinder = ARTexturedGeometry(ARCylinder);
export const ARTexturedCone = ARTexturedGeometry(ARCone);
export const ARTexturedCapsule = ARTexturedGeometry(ARCapsule);
export const ARTexturedPlane = ARTexturedGeometry(ARTexturedPlane);
export const ARTexturedPyramid = ARTexturedGeometry(ARTexturedPyramid);
export const ARTexturedShape = ARTexturedGeometry(ARShape);
export const ARTexturedSphere = ARTexturedGeometry(ARSphere);
export const ARTexturedText = ARTexturedGeometry(ARText);
export const ARTexturedTorus = ARTexturedGeometry(ARTorus);
export const ARTexturedTube = ARTexturedGeometry(ARTube);
//#endregion
//#region adding geometries to nodes
const GeoNode = G => props => {
  return (
    <ARNode {...props}>
      <G {...props} />
    </ARNode>
  );
};

export const ARBoxNode = GeoNode(ARBox);
export const ARCapsuleNode = GeoNode(ARCapsule);
export const ARConeNode = GeoNode(ARCone);
export const ARCylinderNode = GeoNode(ARCylinder);
export const ARPlaneNode = GeoNode(ARPlane);
export const ARPyramidNode = GeoNode(ARPyramid);
export const ARShapeNode = GeoNode(ARShape);
export const ARSphereNode = GeoNode(ARSphere);
export const ARTorusNode = GeoNode(ARTorus);
export const ARTubeNode = GeoNode(ARTube);
export const ARTextNode = GeoNode(ARText);
export const ARColoredBoxNode = GeoNode(ARColoredBox);
export const ARColoredCapsuleNode = GeoNode(ARColoredCapsule);
export const ARColoredConeNode = GeoNode(ARColoredCone);
export const ARColoredCylinderNode = GeoNode(ARColoredCylinder);
export const ARColoredPlaneNode = GeoNode(ARColoredPlane);
export const ARColoredPyramidNode = GeoNode(ARColoredPyramid);
export const ARColoredShapeNode = GeoNode(ARColoredShape);
export const ARColoredSphereNode = GeoNode(ARColoredSphere);
export const ARColoredTorusNode = GeoNode(ARColoredTorus);
export const ARColoredTubeNode = GeoNode(ARColoredTube);
export const ARColoredTextNode = GeoNode(ARColoredText);
export const ARTexturedBoxNode = GeoNode(ARTexturedBox);
export const ARTexturedCapsuleNode = GeoNode(ARTexturedCapsule);
export const ARTexturedConeNode = GeoNode(ARTexturedCone);
export const ARTexturedCylinderNode = GeoNode(ARTexturedCylinder);
export const ARTexturedPlaneNode = GeoNode(ARTexturedPlane);
export const ARTexturedPyramidNode = GeoNode(ARTexturedPyramid);
export const ARTexturedShapeNode = GeoNode(ARTexturedShape);
export const ARTexturedSphereNode = GeoNode(ARTexturedSphere);
export const ARTexturedTorusNode = GeoNode(ARTexturedTorus);
export const ARTexturedTubeNode = GeoNode(ARTexturedTube);
export const ARTexturedTextNode = GeoNode(ARTexturedText);
//#endregion

export const ARPlaneScene = props => {
  return (
    <ARPlane {...props}>
      <ARMaterials>
        <ARMaterialProperty color="yellow">
          <ARSKScene
            {...props}
            height={props.height * props.ppm}
            width={props.width * props.ppm}
          />
        </ARMaterialProperty>
      </ARMaterials>
    </ARPlane>
  );
};
//#sign

export const ARCenteredSKLabel = props => {
  return (
    <ARSKNodeConsumer>
      {({ height, width }) => {
        return (
          <ARSKLabel
            height={height}
            width={width}
            horizontalAlignment="center"
            verticalAlignment="center"
            {...props}
            position={{ x: parseInt(width / 2.0), y: parseInt(height / 2.0) }}
          />
        );
      }}
    </ARSKNodeConsumer>
  );
};
export const ARSign = props => {
  const { height, width, ...labelProps } = props;
  return (
    <ARPlaneScene {...props}>
      <ARCenteredSKLabel {...labelProps} />
    </ARPlaneScene>
  );
};
ARPlaneScene.defaultProps = {
  ppm: 10 * 38, // 10 dpi,
  height: 1,
  width: 1
};
ARPlaneScene.propTypes = {
  ...ARPlane.propTypes,
  ...ARSKScene.propTypes,
  ppm: PropTypes.number
};
ARSign.propTypes = {
  ...ARPlaneScene.propTypes,
  text: PropTypes.string.isRequired
};
ARSign.defaultProps = {
  ...ARPlaneScene.defaultProps
};
export const ARSignNode = GeoNode(ARSign);
export const ARPlaneSceneNode = GeoNode(ARPlaneSceneNode);

export const ARNoSession = props => {
  return (
    <ARSessionConsumer>
      {({ isStarted }) => {
        if (typeof isStarted == undefined)
          throw new Error(
            "ARNoSession must be a descendent of ARSessionProvider"
          );
        if (!isStarted) {
          return props.children;
        }
        return null;
      }}
    </ARSessionConsumer>
  );
};
export const ARIsSession = props => {
  return (
    <ARSessionConsumer>
      {({ isStarted }) => {
        if (typeof isStarted == undefined)
          throw new Error(
            "ARNoSession must be a descendent of ARSessionProvider"
          );
        if (isStarted) {
          return props.children;
        }
        return null;
      }}
    </ARSessionConsumer>
  );
};
export const ARNoTracking = props => {
  return (
    <ARTrackingConsumer>
      {({ anchors }) => {
        if (!anchors || !Object.keys(anchors).length) {
          return props.children;
        }
      }}
    </ARTrackingConsumer>
  );
};
export const ARIsTracking = props => {
  return (
    <ARTrackingConsumer>
      {({ anchors }) => {
        if (anchors && Object.keys(anchors).length) {
          return props.children;
        }
      }}
    </ARTrackingConsumer>
  );
};

export const ARMeNode = props => {
  return (
    <ARPositionConsumer>
      {({ position, orientation }) => {
        if (typeof orientation.x === "undefined") {
          return (
            <ARPositionProvider>
              <ARMeNode {...props} />
            </ARPositionProvider>
          );
        }
        return <ARNode {...props} position={position} />;
      }}
    </ARPositionConsumer>
  );
};

export class ARButton extends Component {
  state = {
    zPos: 0,
    color: "red"
  };
  componentWillMount() {
    this.setState({ color: this.props.color && "blue" });
  }
  render() {
    return (
      <ARAnimatedProvider milliseconds={250}>
        <ARNode
          position={{ z: this.state.zPos }}
          onPressIn={() => {
            this.setState({
              zPos: this.props.pressDepth,
              color: this.props.highlightColor
            });
            this.props.onPressIn && this.props.onPressIn();
          }}
          onPressOut={() => {
            this.setState({ zPos: 0, color: this.props.color });
            this.props.onPressOut && this.props.onPressOut();
          }}
          onPress={this.props.onPress}
        >
          <ARSign
            height={this.props.height}
            width={this.props.width}
            color={this.state.color}
            fontColor={this.props.fontColor}
            text={this.props.title}
            ppm={this.props.ppm}
            fontSize={this.props.fontSize}
          />
        </ARNode>
      </ARAnimatedProvider>
    );
  }
}
ARButton.defaultProps = {
  width: 1,
  height: 0.5,
  color: "blue",
  highlightColor: "purple",
  fontColor: "white",
  onPress: () => {},
  pressDepth: -0.2
};
