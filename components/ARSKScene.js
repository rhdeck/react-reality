import React, { createContext, useState, useContext } from "react";
import { addSKScene, removeSKScene, updateSKScene } from "../RNSwiftBridge";
import { processColor } from "react-native";
import UUID from "uuid/v4";
import { ARMaterialPropertyContext } from "./ARMaterialProperty";
import { useUpdateState } from "../utils";
import consumerIf from "consumerif";
const context = createContext({});
const { Provider: ARSKNodeProvider, Consumer: ARSKNodeConsumer } = context;
const ARSKScene = ({
  height = 100,
  width = 100,
  color,
  id: SKNodeID = UUID()
}) => {
  const { parentNode, materialProperty, index } = useContext(
    ARMaterialPropertyContext
  );
  const [providerValue, setProviderValue] = useState({
    SKNodeID,
    height,
    width
  });
  useEffect(() => {
    setProviderValue({ SKNodeID, height, width });
  }, [height, width]);
  const [isMounted, setIsMounted] = useState(false);
  const [triggerUpdate] = useUpdateState(async () => {
    const scene = {
      height,
      width,
      color: processColor(color),
      name: SKNodeID
    };
    if (!isMounted) {
      await addSKScene(scene, parentNode, index, materialProperty);
      setIsMounted(true);
    } else {
      await updateSKScene(scene, parentNode, index, materialProperty);
    }
  });
  useEffect(() => {
    triggerUpdate();
  }, [height, width, color]);
  useEffect(
    () => async () => {
      try {
        await removeSKScene(parentNode, index, materialProperty);
      } catch (e) {}
    },
    []
  );
  return (
    <ARSKNodeProvider value={providerValue}>
      {consumerIf(children, ARSKNodeConsumer)}
    </ARSKNodeProvider>
  );
};
export { ARSKScene, ARSKNodeConsumer, ARSKNodeProvider };
export default ARSKScene;
