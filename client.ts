import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const light1 = new THREE.PointLight(0xffffff, 0.5);
light1.position.set(1.5, 2.5, 2.5);
//scene.add(light1)

const light2 = new THREE.PointLight(0xffffff, 2);
light2.position.set(-2.5, 2.5, 2.5);
//scene.add(light2)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0.8, 1.4, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

let mixer: THREE.AnimationMixer;
let modelReady = false;
const animationActions: THREE.AnimationAction[] = [];
let activeAction: THREE.AnimationAction;
let lastAction: THREE.AnimationAction;
const gltfLoader = new GLTFLoader();

gltfLoader.load(
  "models/mari.glb",
  (gltf) => {
    // gltf.scene.scale.set(.01, .01, .01)

    mixer = new THREE.AnimationMixer(gltf.scene);

    const animationAction = mixer.clipAction((gltf as any).animations[0]);
    animationActions.push(animationAction);
    animationsFolder.add(animations, "default");
    activeAction = animationActions[0];

    scene.add(gltf.scene);

    //add an animation from another file
    gltfLoader.load(
      "models/mari-idle.glb",
      (gltf) => {
        console.log("loaded idle");
        const animationAction = mixer.clipAction((gltf as any).animations[0]);
        animationActions.push(animationAction);
        animationsFolder.add(animations, "idle");

        //add an animation from another file
        gltfLoader.load(
          "models/mari-run.glb",
          (gltf) => {
            console.log("run");
            const animationAction = mixer.clipAction(
              (gltf as any).animations[0]
            );
            animationActions.push(animationAction);
            animationsFolder.add(animations, "run");

            //add an animation from another file
            gltfLoader.load(
              "models/mari-throw.glb",
              (gltf) => {
                console.log("loaded throw");
                (gltf as any).animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                const animationAction = mixer.clipAction(
                  (gltf as any).animations[0]
                );
                animationActions.push(animationAction);
                animationsFolder.add(animations, "spin_throw");

                modelReady = true;

                gltfLoader.load(
                  "models/mari-attack.glb",
                  (gltf) => {
                    console.log("loaded attack");
                    (gltf as any).animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                    const animationAction = mixer.clipAction(
                      (gltf as any).animations[0]
                    );
                    animationActions.push(animationAction);
                    animationsFolder.add(animations, "attack");

                    modelReady = true;

                    gltfLoader.load(
                      "models/mari-dash.glb",
                      (gltf) => {
                        console.log("loaded dash");
                        (gltf as any).animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                        const animationAction = mixer.clipAction(
                          (gltf as any).animations[0]
                        );
                        animationActions.push(animationAction);
                        animationsFolder.add(animations, "dash");

                        modelReady = true;

                        gltfLoader.load(
                          "models/mari-snap.glb",
                          (gltf) => {
                            console.log("loaded snap");
                            (gltf as any).animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
                            const animationAction = mixer.clipAction(
                              (gltf as any).animations[0]
                            );
                            animationActions.push(animationAction);
                            animationsFolder.add(animations, "snap");

                            modelReady = true;
                          },
                          (xhr) => {
                            console.log(
                              (xhr.loaded / xhr.total) * 100 + "% loaded"
                            );
                          },
                          (error) => {
                            console.log(error);
                          }
                        );
                      },

                      (xhr) => {
                        console.log(
                          (xhr.loaded / xhr.total) * 100 + "% loaded"
                        );
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
                  },
                  (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              },
              (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = Stats();
document.body.appendChild(stats.dom);

const animations = {
  default: function () {
    setAction(animationActions[0]);
  },
  idle: function () {
    setAction(animationActions[1]);
  },
  run: function () {
    setAction(animationActions[2]);
  },
  spin_throw: function () {
    setAction(animationActions[3]);
  },
  attack: function () {
    setAction(animationActions[4]);
  },
  dash: function () {
    setAction(animationActions[5]);
  },
  snap: function () {
    setAction(animationActions[6]);
  }

};

const setAction = (toAction: THREE.AnimationAction) => {
  if (toAction != activeAction) {
    lastAction = activeAction;
    activeAction = toAction;
    //lastAction.stop()
    lastAction.fadeOut(0);
    activeAction.reset();
    activeAction.fadeIn(0);
    activeAction.play();
  }
};
const lights = {
  enabled: function () {
    setLight(true);
  },
  disabled: function () {
    setLight(false);
  },
};
const setLight = (enabled: boolean) => {
  if (enabled) {
    scene.add(light1);
  } else {
    scene.remove(light1);
  }
};
const gui = new GUI();
const animationsFolder = gui.addFolder("Animations");
const lighting = gui.addFolder("Lighting");
animationsFolder.open();
lighting.open();
lighting.add(lights, "enabled");
lighting.add(lights, "disabled");
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (modelReady) mixer.update(clock.getDelta());

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
