import { clearScene } from "./RHDSceneManager";
export default () => {
  // when reloading the app, the scene should be cleared.
  // on prod, this usually does not happen, but you can reload the app in develop mode
  // without clearing, this would result in inconsistency
  ARKitManager.clearScene();
};
