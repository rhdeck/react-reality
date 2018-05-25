import React, { Component, Children } from "react";
import PropTypes from "prop-types";
import {
  blendMode,
  lightingModel,
  shaders,
  colorBufferWriteMask,
  fillMode
} from "./lib/propTypes";
import pickBy from "lodash/pickBy";
import RHDMaterial from "./RHDMaterial";
import { RHDGeometryConsumer } from "./RHDGeometry";
const RHDMaterials = props => {
  if (props.children == null) return null;
  return (
    <RHDGeometryConsumer>
      {({ numSides }) => {
        var out = [];
        for (var s = 0; s < numSides; s++) {
          var c = null;
          c = Children.map(props.children, child => {
            return React.cloneElement(child);
          });
          out.push(<RHDMaterial {...props} index={s} children={c} key={s} />);
        }
        return out;
      }}
    </RHDGeometryConsumer>
  );
};
RHDMaterials.propTypes = pickBy(
  RHDMaterial.propTypes,
  (v, k) => ["index"].indexOf(k) === -1
);
export default RHDMaterials;
