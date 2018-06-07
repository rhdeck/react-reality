import { NativeModules } from "react-native";
import { values } from "lodash";
import PropTypes from "prop-types";

const { ARSceneManager } = NativeModules;

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
  [ARSceneManager.ShaderModifierEntryPoint.Geometry]: PropTypes.string,
  [ARSceneManager.ShaderModifierEntryPoint.Surface]: PropTypes.string,
  [ARSceneManager.ShaderModifierEntryPoint.LightingModel]: PropTypes.string,
  [ARSceneManager.ShaderModifierEntryPoint.Fragment]: PropTypes.string
});

export const lightingModel = PropTypes.oneOf(
  values(ARSceneManager.LightingModel)
);

export const castsShadow = PropTypes.bool;
export const renderingOrder = PropTypes.number;
export const blendMode = PropTypes.oneOf(values(ARSceneManager.BlendMode));
export const chamferMode = PropTypes.oneOf(values(ARSceneManager.ChamferMode));
export const color = PropTypes.string;
export const fillMode = PropTypes.oneOf(values(ARSceneManager.FillMode));

export const lightType = PropTypes.oneOf(values(ARSceneManager.LightType));
export const shadowMode = PropTypes.oneOf(values(ARSceneManager.ShadowMode));
export const colorBufferWriteMask = PropTypes.oneOf(
  values(ARSceneManager.ColorMask)
);

export const opacity = PropTypes.number;
