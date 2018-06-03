import { NativeModules } from "react-native";
import { values } from "lodash";
import PropTypes from "prop-types";

const { RHDSceneManager } = NativeModules;

export const position = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number
});

export const scale = PropTypes.number;
export const categoryBitMask = PropTypes.number;
export const transition = PropTypes.shape({
  duration: PropTypes.number
});
export const eulerAngles = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number
});

export const rotation = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
  w: PropTypes.number
});

export const orientation = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
  w: PropTypes.number
});
export const shaders = PropTypes.shape({
  [RHDSceneManager.ShaderModifierEntryPoint.Geometry]: PropTypes.string,
  [RHDSceneManager.ShaderModifierEntryPoint.Surface]: PropTypes.string,
  [RHDSceneManager.ShaderModifierEntryPoint.LightingModel]: PropTypes.string,
  [RHDSceneManager.ShaderModifierEntryPoint.Fragment]: PropTypes.string
});

export const lightingModel = PropTypes.oneOf(
  values(RHDSceneManager.LightingModel)
);

export const castsShadow = PropTypes.bool;
export const renderingOrder = PropTypes.number;
export const blendMode = PropTypes.oneOf(values(RHDSceneManager.BlendMode));
export const chamferMode = PropTypes.oneOf(values(RHDSceneManager.ChamferMode));
export const color = PropTypes.string;
export const fillMode = PropTypes.oneOf(values(RHDSceneManager.FillMode));

export const lightType = PropTypes.oneOf(values(RHDSceneManager.LightType));
export const shadowMode = PropTypes.oneOf(values(RHDSceneManager.ShadowMode));
export const colorBufferWriteMask = PropTypes.oneOf(
  values(RHDSceneManager.ColorMask)
);

export const opacity = PropTypes.number;
