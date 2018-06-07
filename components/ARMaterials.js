import React, { Component, Children } from "react";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import ARMaterial from "./ARMaterial";
import { ARGeometryConsumer } from "./ARGeometry";
const ARMaterials = props => {
  if (props.children == null) return null;
  return (
    <ARGeometryConsumer>
      {({ numSides }) => {
        var out = [];
        if (!numSides) return null;
        for (var s = 0; s < numSides; s++) {
          var c = null;
          c = Children.map(props.children, child => {
            return React.cloneElement(child);
          });
          out.push(<ARMaterial {...props} index={s} children={c} key={s} />);
        }
        return out;
      }}
    </ARGeometryConsumer>
  );
};
ARMaterials.propTypes = pickBy(
  ARMaterial.propTypes,
  (v, k) => ["index"].indexOf(k) === -1
);
export default ARMaterials;
