import React, { Component, Children } from "react";
import { removeSKNode, setSKLabelNode } from "../RHDSceneManager";
import PropTypes from "prop-types";
import pickBy from "lodash/pickBy";
import UUID from "uuid/v4";
import { RHDSKNodeProvider, RHDSKNodeConsumer } from "./RHDSKScene";
class RHDBaseSKLabel extends Component {
  state = {
    identifier: UUID(),
    updateState: "doMount"
  };
  constructor(props) {
    super(props);
    this.state.providerValue = { SKNodeID: this.state.identifier };
  }
  async nativeUpdate() {
    if (this.state.updateState == "doMount") {
      this.setState({ updateState: "Mounting" });
      try {
        const label = {
          ...propFilter(this.props),
          name: this.state.identifier
        };
        const result = await setSKLabelNode(label, this.props.parentSKNode);
        this.setState(({ updateState }) => {
          return { updateState: updateState == "donext" ? "do" : "done" };
        });
      } catch (e) {
        this.setState({ updateState: "doMount" });
      }
    } else if (this.state.updateState == "do") {
      this.setState({ updateState: "doing" });
      try {
        const label = {
          ...propFilter(this.props),
          name: this.state.identifier
        };
        const result = await setSKLabelNode(label, this.props.parentSKNode);
        this.setState(({ updateState }) => {
          return { updateState: updateState == "donext" ? "do" : "done" };
        });
      } catch (e) {
        this.setState({ updateState: "do" });
      }
    }
  }
  componentDidMount() {
    this.nativeUpdate();
  }
  componentDidUpdate() {
    this.nativeUpdate();
  }
  render() {
    if (["doMount", "Mounting"].indexOf(this.state.updateState) > -1)
      return null;
    if (!this.props.children) return null;
    return (
      <RHDSKNodeProvider value={this.state.providerValue}>
        {this.props.children}
      </RHDSKNodeProvider>
    );
  }
  componentWillUnmount() {
    const result = removeSKNode(this.state.identifier);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    var ret = prevState;
    if (propDiff(nextProps, prevState.SKProps)) {
      ret.SKProps = propFilter(nextProps);
      if (["doMount", "Mounting"].indexOf(prevState.updateState) == -1) {
        ret.updateState = prevState.updateState == "doing" ? "donext" : "do";
      }
    }
    return ret;
  }
}
RHDBaseSKLabel.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  parentSKNode: PropTypes.string,
  text: PropTypes.string,
  id: PropTypes.string,
  fontName: PropTypes.string,
  fontSize: PropTypes.number,
  fontColor: PropTypes.number, // Note this requires a preprocessed color
  width: PropTypes.number
};
const SKLabelKeys = Object.keys(RHDBaseSKLabel.propTypes);
const RHDSKLabel = props => {
  return (
    <RHDSKNodeConsumer>
      {({ SKNodeID }) => {
        return <RHDBaseSKLabel {...props} parentSKNode={SKNodeID} />;
      }}
    </RHDSKNodeConsumer>
  );
};
const propFilter = props => {
  return {
    ...pickBy(props, (v, k) => SKLabelKeys.indexOf(k) > -1)
  };
};

const propDiff = (a, b) => {
  if (a === b) return false;
  if (a & !b || !a & b) return true;
  const af = propFilter(a);
  const bf = propFilter(b);

  const afk = Object.keys(af);
  const bfk = Object.keys(bf);
  if (afk.length != bfk.length) return true;
  if (
    afk.filter(k => {
      return bfk.indexOf(k) === -1;
    }).length
  )
    return true;
  if (
    afk.filter(k => {
      return bf[k] != af[k];
    }).length
  )
    return true;
};

RHDSKLabel.propTypes = { ...RHDBaseSKLabel.propTypes };
export { RHDSKLabel, RHDSKNodeConsumer };
export default RHDSKLabel;
