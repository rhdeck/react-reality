import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import {
  getAnchors,
  setImageDetection,
  subscribeToARImageEvent,
  subscribeToARPlaneEvent,
  setPlaneDetection,
  addRecognizerImage,
  removeRecognizerImage,
  subscribeToARCameraState
} from "./RNSwiftBridge";
const { Provider, Consumer: ARTrackingConsumer } = createContext();
class ARTrackingProvider extends Component {
  state = {
    planeDetection: "none",
    imageDetection: false,
    transition: 0,
    anchors: {},
    providerValue: this.setProviderValue(true),
    trackingLevel: "notAvailable"
  };
  constructor(props) {
    super(props);
    this.state.providerValue = this.setProviderValue(true);
  }
  setProviderValue(skipState) {
    const providerValue = {
      anchors: this.state ? this.state.anchors : {},
      trackingLevel: this.state ? this.state.trackingLevel : "notAvailable"
    };
    if (!skipState)
      this.setState({ providerValue }, () => {
        if (this.props.onUpdateAnchors)
          this.props.onUpdateAnchors(this.state.providerValue.anchors);
      });
    return providerValue;
  }
  render() {
    return (
      <Provider value={this.state.providerValue}>
        {typeof this.props.children == "function" ? (
          <ARTrackingConsumer>{this.props.children}</ARTrackingConsumer>
        ) : (
          this.props.children
        )}
      </Provider>
    );
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const ret = prevState ? prevState : {};
    if (!ret.todos) ret.todos = {};
    if (nextProps.planeDetection != prevState.planeDetection) {
      ret.todos["setPlaneDetection"] = nextProps.planeDetection;
      ret.planeDetection = nextProps.planeDetection;
    }
    if (nextProps.imageDetection != prevState.imageDetection) {
      ret.todos["setImageDetection"] = nextProps.imageDetection;
      ret.imageDetection = nextProps.imageDetection;
    }
    if (ret.imageDetection && propDiff(nextProps.images, prevState.images)) {
      ret.todos["setImages"] = true;
      ret.images = nextProps.images;
    }
    if (!ret.todos || Object.keys(ret.todos) == 0) {
      delete ret.todos;
    }
    return ret;
  }
  cameraStateDetection = null;
  componentDidUpdate() {
    this.manageTodos();
    this.cameraStateDetection = subscribeToARCameraState(
      this.updateCameraState.bind(this)
    );
  }
  componentDidMount() {
    this.manageTodos();
    if (this.cameraStateDetection) this.cameraStateDetection.remove();
    this.cameraStateDetection = null;
  }
  manageTodos() {
    if (this.state.todos) {
      Object.keys(this.state.todos).forEach(k => {
        if (typeof this[k] == "function") {
          this[k](this.state.todos[k]);
        }
      });
      this.setState({ todos: null }, () => {
        this.setProviderValue();
      });
    }
  }
  planeDetection = null;
  async setPlaneDetection(newValue) {
    if (["horizontal", "vertical", "both"].indexOf(newValue) > -1) {
      await setPlaneDetection(newValue);
      this.planeDetection = subscribeToARPlaneEvent(
        this.updatePlanes.bind(this)
      );
    } else if (this.planeDetection) {
      await setPlaneDetection("none");
      this.planeDetection.remove();
      this.planeDetection = null;
    }
  }
  imageDetection = null;
  async setImageDetection(newValue) {
    await setImageDetection(!!newValue);
    if (newValue) {
      this.imageDetection = subscribeToARImageEvent(
        this.updateImages.bind(this)
      );
    }
    if (newValue) addImageDetection(this.updateImages.bind(this));
    else if (this.imageDetection) {
      this.imageDetection.remove();
      this.imageDetection = null;
    }
  }
  registeredImages = {};
  setImages() {
    const newKeys = this.state.images
      ? Object.keys(this.state.images).filter(k => {
          return !this.registeredImages[k];
        })
      : [];
    const deadKeys = this.registeredImages
      ? Object.keys(this.registeredImages).filter(k => {
          return !this.state.images[k];
        })
      : [];
    (async () => {
      await Promise.all(
        newKeys.map(k => {
          const { width, url } = this.state.images[k];
          return addRecognizerImage(url, k, width);
        })
      );
      newKeys.forEach(k => {
        this.registeredImages[k] = this.state.images[k];
      });
      if (deadKeys.length) {
        await Promise.all(
          deadKeys.map(k => {
            return removeRecognizerImage(k);
          })
        );
        this.setState(({ images }) => {
          deadKeys.forEach(k => {
            delete images[k];
          });
          return { images: { ...images } };
        });
      }
    })();
  }
  async updatePlanes(planeData) {
    const data = planeData && planeData.data;
    if (!data) {
      const anchors = cleanAnchors(await getAnchors(data));
      this.setState({ anchors: anchors }, () => {
        this.setProviderValue();
      });
    } else
      switch (data.key) {
        case "planeAnchorAdded":
        case "planeAnchorChanged":
          const k = data.id;
          const anchor = cleanAnchor(data.anchor);
          if (
            !this.state.anchors[k] ||
            propDiff(this.state.anchors[k], anchor, cleanAnchor)
          ) {
            this.setState(
              ({ anchors }) => {
                return { anchors: { ...anchors, [k]: anchor } };
              },
              () => {
                this.setProviderValue();
              }
            );
          }
          break;
        case "planeAnchorRemoved":
        default:
          const anchors = cleanAnchors(await getAnchors(data));
          this.setState({ anchors: anchors }, () => {
            this.setProviderValue();
          });
      }
  }
  async updateImages(data) {
    const anchors = await getAnchors(data);
    this.setState({ anchors: anchors }, () => {
      this.setProviderValue();
    });
  }
  async updateCameraState(data) {
    this.setState({ trackingLevel: data }, () => {
      this.setProviderValue();
    });
  }
}
ARTrackingProvider.propTypes = {
  planeDetection: PropTypes.string,
  imageDetection: PropTypes.bool,
  onUpdateAnchors: PropTypes.func,
  images: PropTypes.object
};
export { ARTrackingProvider, ARTrackingConsumer };
export default ARTrackingProvider;
const cleanAnchors = o => {
  var out = {};
  if (!o) return out;
  Object.keys(o).forEach(k => {
    const v = o[k];
    out[k] = cleanAnchor(v);
  });
  return out;
};
const cleanAnchor = v => {
  var out = {};
  if (!v) return out;
  if (v.plane) {
    if (v.plane.width)
      v.plane.width = parseFloat(parseFloat(v.plane.width).toFixed(1));
    if (v.plane.height)
      v.plane.height = parseFloat(parseFloat(v.plane.height).toFixed(1));
  }
  return v;
};
const propDiff = (a, b, filterFunc) => {
  if (a === b) return false;
  if ((a && !b) || (!a && b)) return true;
  if (!a && !b) return false;
  const af = filterFunc ? filterFunc(a) : a;
  const bf = filterFunc ? filterFunc(b) : b;

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
