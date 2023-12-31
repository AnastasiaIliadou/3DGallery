import {
  GLTFLoader
} from "./chunk-2SLBUFNL.js";
import {
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry
} from "./chunk-MOCVLCHI.js";
import "./chunk-4EOJPDL2.js";

// ../node_modules/three/examples/jsm/libs/motion-controllers.module.js
var Constants = {
  Handedness: Object.freeze({
    NONE: "none",
    LEFT: "left",
    RIGHT: "right"
  }),
  ComponentState: Object.freeze({
    DEFAULT: "default",
    TOUCHED: "touched",
    PRESSED: "pressed"
  }),
  ComponentProperty: Object.freeze({
    BUTTON: "button",
    X_AXIS: "xAxis",
    Y_AXIS: "yAxis",
    STATE: "state"
  }),
  ComponentType: Object.freeze({
    TRIGGER: "trigger",
    SQUEEZE: "squeeze",
    TOUCHPAD: "touchpad",
    THUMBSTICK: "thumbstick",
    BUTTON: "button"
  }),
  ButtonTouchThreshold: 0.05,
  AxisTouchThreshold: 0.1,
  VisualResponseProperty: Object.freeze({
    TRANSFORM: "transform",
    VISIBILITY: "visibility"
  })
};
async function fetchJsonFile(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(response.statusText);
  } else {
    return response.json();
  }
}
async function fetchProfilesList(basePath) {
  if (!basePath) {
    throw new Error("No basePath supplied");
  }
  const profileListFileName = "profilesList.json";
  const profilesList = await fetchJsonFile(`${basePath}/${profileListFileName}`);
  return profilesList;
}
async function fetchProfile(xrInputSource, basePath, defaultProfile = null, getAssetPath = true) {
  if (!xrInputSource) {
    throw new Error("No xrInputSource supplied");
  }
  if (!basePath) {
    throw new Error("No basePath supplied");
  }
  const supportedProfilesList = await fetchProfilesList(basePath);
  let match;
  xrInputSource.profiles.some((profileId) => {
    const supportedProfile = supportedProfilesList[profileId];
    if (supportedProfile) {
      match = {
        profileId,
        profilePath: `${basePath}/${supportedProfile.path}`,
        deprecated: !!supportedProfile.deprecated
      };
    }
    return !!match;
  });
  if (!match) {
    if (!defaultProfile) {
      throw new Error("No matching profile name found");
    }
    const supportedProfile = supportedProfilesList[defaultProfile];
    if (!supportedProfile) {
      throw new Error(`No matching profile name found and default profile "${defaultProfile}" missing.`);
    }
    match = {
      profileId: defaultProfile,
      profilePath: `${basePath}/${supportedProfile.path}`,
      deprecated: !!supportedProfile.deprecated
    };
  }
  const profile = await fetchJsonFile(match.profilePath);
  let assetPath;
  if (getAssetPath) {
    let layout;
    if (xrInputSource.handedness === "any") {
      layout = profile.layouts[Object.keys(profile.layouts)[0]];
    } else {
      layout = profile.layouts[xrInputSource.handedness];
    }
    if (!layout) {
      throw new Error(
        `No matching handedness, ${xrInputSource.handedness}, in profile ${match.profileId}`
      );
    }
    if (layout.assetPath) {
      assetPath = match.profilePath.replace("profile.json", layout.assetPath);
    }
  }
  return { profile, assetPath };
}
var defaultComponentValues = {
  xAxis: 0,
  yAxis: 0,
  button: 0,
  state: Constants.ComponentState.DEFAULT
};
function normalizeAxes(x = 0, y = 0) {
  let xAxis = x;
  let yAxis = y;
  const hypotenuse = Math.sqrt(x * x + y * y);
  if (hypotenuse > 1) {
    const theta = Math.atan2(y, x);
    xAxis = Math.cos(theta);
    yAxis = Math.sin(theta);
  }
  const result = {
    normalizedXAxis: xAxis * 0.5 + 0.5,
    normalizedYAxis: yAxis * 0.5 + 0.5
  };
  return result;
}
var VisualResponse = class {
  constructor(visualResponseDescription) {
    this.componentProperty = visualResponseDescription.componentProperty;
    this.states = visualResponseDescription.states;
    this.valueNodeName = visualResponseDescription.valueNodeName;
    this.valueNodeProperty = visualResponseDescription.valueNodeProperty;
    if (this.valueNodeProperty === Constants.VisualResponseProperty.TRANSFORM) {
      this.minNodeName = visualResponseDescription.minNodeName;
      this.maxNodeName = visualResponseDescription.maxNodeName;
    }
    this.value = 0;
    this.updateFromComponent(defaultComponentValues);
  }
  /**
   * Computes the visual response's interpolation weight based on component state
   * @param {Object} componentValues - The component from which to update
   * @param {number} xAxis - The reported X axis value of the component
   * @param {number} yAxis - The reported Y axis value of the component
   * @param {number} button - The reported value of the component's button
   * @param {string} state - The component's active state
   */
  updateFromComponent({
    xAxis,
    yAxis,
    button,
    state
  }) {
    const { normalizedXAxis, normalizedYAxis } = normalizeAxes(xAxis, yAxis);
    switch (this.componentProperty) {
      case Constants.ComponentProperty.X_AXIS:
        this.value = this.states.includes(state) ? normalizedXAxis : 0.5;
        break;
      case Constants.ComponentProperty.Y_AXIS:
        this.value = this.states.includes(state) ? normalizedYAxis : 0.5;
        break;
      case Constants.ComponentProperty.BUTTON:
        this.value = this.states.includes(state) ? button : 0;
        break;
      case Constants.ComponentProperty.STATE:
        if (this.valueNodeProperty === Constants.VisualResponseProperty.VISIBILITY) {
          this.value = this.states.includes(state);
        } else {
          this.value = this.states.includes(state) ? 1 : 0;
        }
        break;
      default:
        throw new Error(`Unexpected visualResponse componentProperty ${this.componentProperty}`);
    }
  }
};
var Component = class {
  /**
   * @param {Object} componentId - Id of the component
   * @param {Object} componentDescription - Description of the component to be created
   */
  constructor(componentId, componentDescription) {
    if (!componentId || !componentDescription || !componentDescription.visualResponses || !componentDescription.gamepadIndices || Object.keys(componentDescription.gamepadIndices).length === 0) {
      throw new Error("Invalid arguments supplied");
    }
    this.id = componentId;
    this.type = componentDescription.type;
    this.rootNodeName = componentDescription.rootNodeName;
    this.touchPointNodeName = componentDescription.touchPointNodeName;
    this.visualResponses = {};
    Object.keys(componentDescription.visualResponses).forEach((responseName) => {
      const visualResponse = new VisualResponse(componentDescription.visualResponses[responseName]);
      this.visualResponses[responseName] = visualResponse;
    });
    this.gamepadIndices = Object.assign({}, componentDescription.gamepadIndices);
    this.values = {
      state: Constants.ComponentState.DEFAULT,
      button: this.gamepadIndices.button !== void 0 ? 0 : void 0,
      xAxis: this.gamepadIndices.xAxis !== void 0 ? 0 : void 0,
      yAxis: this.gamepadIndices.yAxis !== void 0 ? 0 : void 0
    };
  }
  get data() {
    const data = { id: this.id, ...this.values };
    return data;
  }
  /**
   * @description Poll for updated data based on current gamepad state
   * @param {Object} gamepad - The gamepad object from which the component data should be polled
   */
  updateFromGamepad(gamepad) {
    this.values.state = Constants.ComponentState.DEFAULT;
    if (this.gamepadIndices.button !== void 0 && gamepad.buttons.length > this.gamepadIndices.button) {
      const gamepadButton = gamepad.buttons[this.gamepadIndices.button];
      this.values.button = gamepadButton.value;
      this.values.button = this.values.button < 0 ? 0 : this.values.button;
      this.values.button = this.values.button > 1 ? 1 : this.values.button;
      if (gamepadButton.pressed || this.values.button === 1) {
        this.values.state = Constants.ComponentState.PRESSED;
      } else if (gamepadButton.touched || this.values.button > Constants.ButtonTouchThreshold) {
        this.values.state = Constants.ComponentState.TOUCHED;
      }
    }
    if (this.gamepadIndices.xAxis !== void 0 && gamepad.axes.length > this.gamepadIndices.xAxis) {
      this.values.xAxis = gamepad.axes[this.gamepadIndices.xAxis];
      this.values.xAxis = this.values.xAxis < -1 ? -1 : this.values.xAxis;
      this.values.xAxis = this.values.xAxis > 1 ? 1 : this.values.xAxis;
      if (this.values.state === Constants.ComponentState.DEFAULT && Math.abs(this.values.xAxis) > Constants.AxisTouchThreshold) {
        this.values.state = Constants.ComponentState.TOUCHED;
      }
    }
    if (this.gamepadIndices.yAxis !== void 0 && gamepad.axes.length > this.gamepadIndices.yAxis) {
      this.values.yAxis = gamepad.axes[this.gamepadIndices.yAxis];
      this.values.yAxis = this.values.yAxis < -1 ? -1 : this.values.yAxis;
      this.values.yAxis = this.values.yAxis > 1 ? 1 : this.values.yAxis;
      if (this.values.state === Constants.ComponentState.DEFAULT && Math.abs(this.values.yAxis) > Constants.AxisTouchThreshold) {
        this.values.state = Constants.ComponentState.TOUCHED;
      }
    }
    Object.values(this.visualResponses).forEach((visualResponse) => {
      visualResponse.updateFromComponent(this.values);
    });
  }
};
var MotionController = class {
  /**
   * @param {Object} xrInputSource - The XRInputSource to build the MotionController around
   * @param {Object} profile - The best matched profile description for the supplied xrInputSource
   * @param {Object} assetUrl
   */
  constructor(xrInputSource, profile, assetUrl) {
    if (!xrInputSource) {
      throw new Error("No xrInputSource supplied");
    }
    if (!profile) {
      throw new Error("No profile supplied");
    }
    this.xrInputSource = xrInputSource;
    this.assetUrl = assetUrl;
    this.id = profile.profileId;
    this.layoutDescription = profile.layouts[xrInputSource.handedness];
    this.components = {};
    Object.keys(this.layoutDescription.components).forEach((componentId) => {
      const componentDescription = this.layoutDescription.components[componentId];
      this.components[componentId] = new Component(componentId, componentDescription);
    });
    this.updateFromGamepad();
  }
  get gripSpace() {
    return this.xrInputSource.gripSpace;
  }
  get targetRaySpace() {
    return this.xrInputSource.targetRaySpace;
  }
  /**
   * @description Returns a subset of component data for simplified debugging
   */
  get data() {
    const data = [];
    Object.values(this.components).forEach((component) => {
      data.push(component.data);
    });
    return data;
  }
  /**
   * @description Poll for updated data based on current gamepad state
   */
  updateFromGamepad() {
    Object.values(this.components).forEach((component) => {
      component.updateFromGamepad(this.xrInputSource.gamepad);
    });
  }
};

// ../node_modules/three/examples/jsm/webxr/XRControllerModelFactory.js
var DEFAULT_PROFILES_PATH = "https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles";
var DEFAULT_PROFILE = "generic-trigger";
var XRControllerModel = class extends Object3D {
  constructor() {
    super();
    this.motionController = null;
    this.envMap = null;
  }
  setEnvironmentMap(envMap) {
    if (this.envMap == envMap) {
      return this;
    }
    this.envMap = envMap;
    this.traverse((child) => {
      if (child.isMesh) {
        child.material.envMap = this.envMap;
        child.material.needsUpdate = true;
      }
    });
    return this;
  }
  /**
   * Polls data from the XRInputSource and updates the model's components to match
   * the real world data
   */
  updateMatrixWorld(force) {
    super.updateMatrixWorld(force);
    if (!this.motionController)
      return;
    this.motionController.updateFromGamepad();
    Object.values(this.motionController.components).forEach((component) => {
      Object.values(component.visualResponses).forEach((visualResponse) => {
        const { valueNode, minNode, maxNode, value, valueNodeProperty } = visualResponse;
        if (!valueNode)
          return;
        if (valueNodeProperty === Constants.VisualResponseProperty.VISIBILITY) {
          valueNode.visible = value;
        } else if (valueNodeProperty === Constants.VisualResponseProperty.TRANSFORM) {
          valueNode.quaternion.slerpQuaternions(
            minNode.quaternion,
            maxNode.quaternion,
            value
          );
          valueNode.position.lerpVectors(
            minNode.position,
            maxNode.position,
            value
          );
        }
      });
    });
  }
};
function findNodes(motionController, scene) {
  Object.values(motionController.components).forEach((component) => {
    const { type, touchPointNodeName, visualResponses } = component;
    if (type === Constants.ComponentType.TOUCHPAD) {
      component.touchPointNode = scene.getObjectByName(touchPointNodeName);
      if (component.touchPointNode) {
        const sphereGeometry = new SphereGeometry(1e-3);
        const material = new MeshBasicMaterial({ color: 255 });
        const sphere = new Mesh(sphereGeometry, material);
        component.touchPointNode.add(sphere);
      } else {
        console.warn(`Could not find touch dot, ${component.touchPointNodeName}, in touchpad component ${component.id}`);
      }
    }
    Object.values(visualResponses).forEach((visualResponse) => {
      const { valueNodeName, minNodeName, maxNodeName, valueNodeProperty } = visualResponse;
      if (valueNodeProperty === Constants.VisualResponseProperty.TRANSFORM) {
        visualResponse.minNode = scene.getObjectByName(minNodeName);
        visualResponse.maxNode = scene.getObjectByName(maxNodeName);
        if (!visualResponse.minNode) {
          console.warn(`Could not find ${minNodeName} in the model`);
          return;
        }
        if (!visualResponse.maxNode) {
          console.warn(`Could not find ${maxNodeName} in the model`);
          return;
        }
      }
      visualResponse.valueNode = scene.getObjectByName(valueNodeName);
      if (!visualResponse.valueNode) {
        console.warn(`Could not find ${valueNodeName} in the model`);
      }
    });
  });
}
function addAssetSceneToControllerModel(controllerModel, scene) {
  findNodes(controllerModel.motionController, scene);
  if (controllerModel.envMap) {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.envMap = controllerModel.envMap;
        child.material.needsUpdate = true;
      }
    });
  }
  controllerModel.add(scene);
}
var XRControllerModelFactory = class {
  constructor(gltfLoader = null) {
    this.gltfLoader = gltfLoader;
    this.path = DEFAULT_PROFILES_PATH;
    this._assetCache = {};
    if (!this.gltfLoader) {
      this.gltfLoader = new GLTFLoader();
    }
  }
  createControllerModel(controller) {
    const controllerModel = new XRControllerModel();
    let scene = null;
    controller.addEventListener("connected", (event) => {
      const xrInputSource = event.data;
      if (xrInputSource.targetRayMode !== "tracked-pointer" || !xrInputSource.gamepad)
        return;
      fetchProfile(xrInputSource, this.path, DEFAULT_PROFILE).then(({ profile, assetPath }) => {
        controllerModel.motionController = new MotionController(
          xrInputSource,
          profile,
          assetPath
        );
        const cachedAsset = this._assetCache[controllerModel.motionController.assetUrl];
        if (cachedAsset) {
          scene = cachedAsset.scene.clone();
          addAssetSceneToControllerModel(controllerModel, scene);
        } else {
          if (!this.gltfLoader) {
            throw new Error("GLTFLoader not set.");
          }
          this.gltfLoader.setPath("");
          this.gltfLoader.load(
            controllerModel.motionController.assetUrl,
            (asset) => {
              this._assetCache[controllerModel.motionController.assetUrl] = asset;
              scene = asset.scene.clone();
              addAssetSceneToControllerModel(controllerModel, scene);
            },
            null,
            () => {
              throw new Error(`Asset ${controllerModel.motionController.assetUrl} missing or malformed.`);
            }
          );
        }
      }).catch((err) => {
        console.warn(err);
      });
    });
    controller.addEventListener("disconnected", () => {
      controllerModel.motionController = null;
      controllerModel.remove(scene);
      scene = null;
    });
    return controllerModel;
  }
};
export {
  XRControllerModelFactory
};
//# sourceMappingURL=three_addons_webxr_XRControllerModelFactory__js.js.map
