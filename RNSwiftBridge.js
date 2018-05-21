import { NativeModules } from "react-native";
//#region Code for object RHDMonoViewManager
const NativeRHDMonoViewManager = NativeModules.RHDMonoViewManager;
const doTap = async (x, y) => {
  return await NativeRHDMonoViewManager.doTap(x, y);
};
//#endregion
//#region Code for object RHDSceneManager
const NativeRHDSceneManager = NativeModules.RHDSceneManager;
const addNode = async (node, parentID) => {
  return await NativeRHDSceneManager.addNode(node, parentID);
};
const removeNode = async id => {
  return await NativeRHDSceneManager.removeNode(id);
};
const updateNode = async (forNode, newProps) => {
  return await NativeRHDSceneManager.updateNode(forNode, newProps);
};
const setBox = async (g, forNode) => {
  return await NativeRHDSceneManager.setBox(g, forNode);
};
const setCapsule = async (g, forNode) => {
  return await NativeRHDSceneManager.setCapsule(g, forNode);
};
const setCone = async (g, forNode) => {
  return await NativeRHDSceneManager.setCone(g, forNode);
};
const setCylinder = async (g, forNode) => {
  return await NativeRHDSceneManager.setCylinder(g, forNode);
};
const setPlane = async (g, forNode) => {
  return await NativeRHDSceneManager.setPlane(g, forNode);
};
const setPyramid = async (g, forNode) => {
  return await NativeRHDSceneManager.setPyramid(g, forNode);
};
const setSphere = async (g, forNode) => {
  return await NativeRHDSceneManager.setSphere(g, forNode);
};
const setText = async (g, forNode) => {
  return await NativeRHDSceneManager.setText(g, forNode);
};
const setTorus = async (g, forNode) => {
  return await NativeRHDSceneManager.setTorus(g, forNode);
};
const setTube = async (g, forNode) => {
  return await NativeRHDSceneManager.setTube(g, forNode);
};
const setGeometry = async (geometry, forNode) => {
  return await NativeRHDSceneManager.setGeometry(geometry, forNode);
};
const setMaterial = async (material, forNode, atPosition) => {
  return await NativeRHDSceneManager.setMaterial(material, forNode, atPosition);
};
const setMaterialProperty = async (
  json,
  propertyName,
  forMaterialAtPosition,
  forNode
) => {
  return await NativeRHDSceneManager.setMaterialProperty(
    json,
    propertyName,
    forMaterialAtPosition,
    forNode
  );
};
const removeGeometry = async forNode => {
  return await NativeRHDSceneManager.removeGeometry(forNode);
};
const removeMaterial = async (forNode, atPosition) => {
  return await NativeRHDSceneManager.removeMaterial(forNode, atPosition);
};
const addSKSceneReference = async scene => {
  return await NativeRHDSceneManager.addSKSceneReference(scene);
};
const addSKSceneByReference = async (
  sceneName,
  forNode,
  atPosition,
  withType
) => {
  return await NativeRHDSceneManager.addSKSceneByReference(
    sceneName,
    forNode,
    atPosition,
    withType
  );
};
const addSKScene = async (scene, forNode, atPosition, withType) => {
  return await NativeRHDSceneManager.addSKScene(
    scene,
    forNode,
    atPosition,
    withType
  );
};
const setSKLabelNode = async (node, toParent) => {
  return await NativeRHDSceneManager.setSKLabelNode(node, toParent);
};
const updateSKLabelNode = async json => {
  return await NativeRHDSceneManager.updateSKLabelNode(json);
};
const setSKNode = async (node, toParent) => {
  return await NativeRHDSceneManager.setSKNode(node, toParent);
};
const removeSKNode = async name => {
  return await NativeRHDSceneManager.removeSKNode(name);
};
const removeSKScene = async (forNode, atPosition, withType) => {
  return await NativeRHDSceneManager.removeSKScene(
    forNode,
    atPosition,
    withType
  );
};
const addSKLabelNode = async (node, toParent) => {
  return await NativeRHDSceneManager.addSKLabelNode(node, toParent);
};
const addSKNode = async (node, toParent) => {
  return await NativeRHDSceneManager.addSKNode(node, toParent);
};
const clear = async () => {
  return await NativeRHDSceneManager.clear();
};
const resume = async () => {
  return await NativeRHDSceneManager.resume();
};
const pause = async () => {
  return await NativeRHDSceneManager.pause();
};
const getAnchors = async () => {
  return await NativeRHDSceneManager.getAnchors();
};
const addRecognizerImage = async (url, name) => {
  return await NativeRHDSceneManager.addRecognizerImage(url, name);
};
const removeRecognizerImage = async name => {
  return await NativeRHDSceneManager.removeRecognizerImage(name);
};
//#endregion
//#region Exports
export {
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
  getAnchors,
  addRecognizerImage,
  removeRecognizerImage
};
//#endregion
