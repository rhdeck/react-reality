import { NativeModules } from "react-native";
import { values } from "lodash";
import PropTypes from "prop-types";

const NativeSceneManager = NativeModules.RHDSceneManager;

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
  [NativeSceneManager.ShaderModifierEntryPoint.Geometry]: PropTypes.string,
  [NativeSceneManager.ShaderModifierEntryPoint.Surface]: PropTypes.string,
  [NativeSceneManager.ShaderModifierEntryPoint.LightingModel]: PropTypes.string,
  [NativeSceneManager.ShaderModifierEntryPoint.Fragment]: PropTypes.string
});

export const lightingModel = PropTypes.oneOf(
  values(NativeSceneManager.LightingModel)
);

export const castsShadow = PropTypes.bool;
export const renderingOrder = PropTypes.number;
export const blendMode = PropTypes.oneOf(values(NativeSceneManager.BlendMode));
export const chamferMode = PropTypes.oneOf(
  values(NativeSceneManager.ChamferMode)
);
export const color = PropTypes.string;
export const fillMode = PropTypes.oneOf(values(NativeSceneManager.FillMode));

export const lightType = PropTypes.oneOf(values(NativeSceneManager.LightType));
export const shadowMode = PropTypes.oneOf(
  values(NativeSceneManager.ShadowMode)
);
export const colorBufferWriteMask = PropTypes.oneOf(
  values(NativeSceneManager.ColorMask)
);

export const opacity = PropTypes.number;
