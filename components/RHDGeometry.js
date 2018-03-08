import React, { Component, Children } from "react";
import { NativeModules } from "react-native";
import PropTypes from "prop-types";
import filter from "lodash/filter";
import pickBy from "lodash/pickBy";
const { RHDSceneManager } = NativeModules;

export default (type, geomProps, numSides) => {
  const Geom = class extends Component {
    async nativeUpdate() {
      if (!this.props.parentNode)
        throw new Error("Cannot mount a Geometry without a parent Node");
      const mountFunc = RHDSceneManager["set" + type];
      const filteredProps = pickBy(this.props, (v, k) => {
        return geomPropKeys.indexOf(k) > -1;
      });

      try {
        await mountFunc(
          {
            ...filteredProps
          },
          this.props.parentNode
        );
      } catch (e) {}
    }
    async componentWillMount() {
      console.log("Running CWM");
      await this.nativeUpdate();
    }
    async componentWillUpdate(nextProps) {
      console.log("And now I will update", type);
      this.nativeUpdate();
    }
    componentWillReceiveProps(nextProps) {
      console.log("Here come the geom props", type, nextProps);
    }
    shouldComponentUpdate(nextProps) {
      console.log("I am told I should update", type);
      return type == "Text";
    }
    async componentWillUnmount() {
      if (!this.props.parentNode)
        throw new Error("Cannot mount a Geometry without a parent Node");
      try {
        await RHDSceneManager.removeGeometry(this.props.parentNode);
      } catch (e) {}
    }
    render() {
      if (!this.props.children) return null;
      const c = Children.map(this.props.children, child => {
        return React.cloneElement(child, {
          parentNode: this.props.parentNode,
          numSides
        });
      });
      return c;
    }
  };
  Geom.propTypes = {
    ...geomProps,
    parentNode: PropTypes.string
  };
  const geomPropKeys = Object.keys(Geom.propTypes);
  return Geom;
};
