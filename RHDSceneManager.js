import { NativeModules, NativeEventEmitter } from "react-native";
import {
  doTap,
  addNode,
  removeNode,
  updateNode,
  setBox,
  setCapsule,
  setCone,
  setCylinder,
  setPlane,
  setPyramid,
  setSphere,
  setText,
  setTorus,
  setTube,
  setGeometry,
  setMaterial,
  setMaterialProperty,
  removeGeometry,
  removeMaterial,
  addSKSceneReference,
  addSKSceneByReference,
  addSKScene,
  setSKLabelNode,
  updateSKLabelNode,
  setSKNode,
  removeSKNode,
  removeSKScene,
  addSKLabelNode,
  addSKNode,
  clear,
  resume,
  pause,
  addRecognizerImage,
  removeRecognizerImage,
  setPlaneDetection,
  setImageDetection,
  setAnimationDuration,
  setAnimationType,
  setAnimation,
  getAnchors,
  updateSKScene,
  getPOV,
  setPOVSensitivity,
  setWorldTracking
} from "./RNSwiftBridge";
const NativeObj = NativeModules.RHDSceneManager;
//const { RHDSceneManager } = NativeModules;
//#region Event Management
var cachedEmitter = null;
var cachedListener = null;
var cachedHandlers = {};
const getEmitter = () => {
  if (!cachedEmitter) {
    cachedEmitter = new NativeEventEmitter(NativeObj);
  }
  return cachedEmitter;
};
const addListener = (key, cb) => {
  if (!cachedListener) {
    cachedListener = getEmitter().addListener("RHDEvent", masterHandler);
  }
  cachedHandlers[key] = cb;
};
const masterHandler = body => {
  const key = body.key;
  if (!key) {
    console.log("No key specified in event ", body);
    return;
  }
  const data = body.data;
  if (typeof cachedHandlers[key] == "function") cachedHandlers[key](data);
  else console.log("No handler for key", key);
};
const removeListener = key => {
  delete cachedHandlers[key];
};
const stopListening = () => {
  if (cachedListener) {
    cachedListener.remove();
  }
  cachedHandlers = {};
};
//#endregion
//#region Plane Detection
var cachedPlaneListener;
var cachedPlaneHandler;
const addPlaneDetection = async (type, cb) => {
  cachedPlaneHandler = cb;
  if (!cachedPlaneListener) {
    cachedPlaneListener = getEmitter().addListener(
      "RHDPlaneEvent",
      cachedPlaneHandler
    );
  }
  await setPlaneDetection(type);
};
const removePlaneDetection = async () => {
  await setPlaneDetection("none");
  if (cachedPlaneListener) cachedPlaneListener.remove();
  cachedPlaneHandler = null;
  cachedPlaneListener = null;
};
//#endregion
//#region Image Detection
var cachedImageListener;
var cachedImageHandler;
const addImageDetection = async cb => {
  cachedImageHandler = cb;
  if (!cachedImageListener) {
    cachedImageListener = getEmitter().addListener(
      "RHDImageEvent",
      cachedImageHandler
    );
  }
  return await setImageDetection(true);
};
const removeImageDetection = async () => {
  if (cachedImageListener) cachedImageListener.remove();
  cachedImageHandler = null;
  cachedImageListener = null;
  removeListener("imageDetected");
  return await setImageDetection(false);
};

const removeAnimation = async () => {
  return await setAnimationDuration(0);
};
const detectPositionChange = cb => {
  addListener("positionChanged", cb);
};
const stopDetectPositionChange = () => {
  removeListener("positionChanged");
};
export {
  clear,
  resume,
  pause,
  doTap,
  setMaterial,
  setMaterialProperty,
  removeMaterial,
  addNode,
  removeNode,
  updateNode,
  addSKLabelNode,
  addSKNode,
  addSKScene,
  addSKSceneByReference,
  addSKSceneReference,
  setSKLabelNode,
  setSKNode,
  addPlaneDetection,
  removePlaneDetection,
  addImageDetection,
  removeImageDetection,
  addRecognizerImage,
  removeRecognizerImage,
  setAnimationType,
  removeAnimation,
  setAnimationDuration,
  setAnimation,
  getAnchors,
  removeSKNode,
  removeSKScene,
  updateSKScene,
  detectPositionChange,
  stopDetectPositionChange,
  getPOV,
  setPOVSensitivity,
  setWorldTracking
};
