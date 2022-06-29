import * as THREE from "three";
import { DoubleSide } from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import meshLoader from "./meshLoader.js";
import { GUI } from "dat.gui";
//boolean variables that are hooked up to the html as listeners so they change on a button click
var seamstress = false;
var cape = false;
var mixer;
var modelReady = false;
var animationActions = [];
var activeAction;
var lastAction;
var gui = new GUI({});
var animationsFolder = gui.addFolder("Animations");

var customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);


//loads seamstress model, cannot be made generic since models are very specific and have varying parameters
function seamstressLoader() {
	var gltfLoader = new GLTFLoader();
	var mainMaterial = new THREE.MeshToonMaterial();
	var hairMaterial = new THREE.MeshToonMaterial();
    var faceMaterial = new THREE.MeshToonMaterial();

	var faceTexture = new THREE.TextureLoader().load('models/textures/toon face.png');
	faceTexture.flipY = false;
	
	var mainTexture = new THREE.TextureLoader().load('models/textures/clothing_Base_color.png');
	mainTexture.flipY = false;
	var hairTexture = new THREE.TextureLoader().load('models/textures/hair_Base_color.png');
	hairTexture.flipY = false;

	mainMaterial.map = mainTexture;
	hairMaterial.map = hairTexture;
	faceMaterial.map = faceTexture;

	mainMaterial.side = DoubleSide

	$(gui.domElement).attr("hidden", false)
	gltfLoader.load("models/mari.glb", function(gltf) {

		gltf.scene.traverse(function(child) {

			if (child.isMesh) {
				var m = child;
				var n = m.material;
				if (n.name == "MAIN") {
					m.material = mainMaterial;
				}
				if (n.name == "FACE") {
					m.material = faceMaterial;
				}
				if (n.name == "HAIR") {
					m.material = hairMaterial;
				}
			}
		});
		var mesh = gltf.scene;
		
		
		
		mixer = new THREE.AnimationMixer(gltf.scene);

		var animationAction = mixer.clipAction(gltf.animations[0]);
		animationActions.push(animationAction);
		animationsFolder.add(animations, "default");
		activeAction = animationActions[0];
	
		//add an animation from another file
		gltfLoader.load("models/mari-idle.glb", function (gltf) {
			console.log("loaded idle");
			var animationAction = mixer.clipAction(gltf.animations[0]);
			animationActions.push(animationAction);
			animationsFolder.add(animations, "idle");
			//add an animation from another file
			gltfLoader.load("models/mari-run.glb", function (gltf) {
				console.log("run");
				var animationAction = mixer.clipAction(gltf.animations[0]);
				animationActions.push(animationAction);
				animationsFolder.add(animations, "run");
				//add an animation from another file
				gltfLoader.load("models/mari-throw.glb", function (gltf) {
					console.log("loaded throw");
					gltf.animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
					var animationAction = mixer.clipAction(gltf.animations[0]);
					animationActions.push(animationAction);
					animationsFolder.add(animations, "spin_throw");
					modelReady = true;
					gltfLoader.load("models/mari-attack.glb", function (gltf) {
						console.log("loaded attack");
						gltf.animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
						var animationAction = mixer.clipAction(gltf.animations[0]);
						animationActions.push(animationAction);
						animationsFolder.add(animations, "attack");
						modelReady = true;
						gltfLoader.load("models/mari-dash.glb", function (gltf) {
							console.log("loaded dash");
							gltf.animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
							var animationAction = mixer.clipAction(gltf.animations[0]);
							animationActions.push(animationAction);
							animationsFolder.add(animations, "dash");
							modelReady = true;
							gltfLoader.load("models/mari-snap.glb", function (gltf) {
								console.log("loaded snap");
								gltf.animations[0].tracks.shift(); //delete the specific track that moves the object forward while running
								var animationAction = mixer.clipAction(gltf.animations[0]);
								animationActions.push(animationAction);
								animationsFolder.add(animations, "snap");
								modelReady = true;
							}, function (xhr) {
								console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
							}, function (error) {
								console.log(error);
							});
						}, function (xhr) {
							console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
						}, function (error) {
							console.log(error);
						});
					}, function (xhr) {
						console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
					}, function (error) {
						console.log(error);
					});
				}, function (xhr) {
					console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
				}, function (error) {
					console.log(error);
				});
			}, function (xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			}, function (error) {
				console.log(error);
			});
		}, function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		}, function (error) {
			console.log(error);
		});
		var display = meshLoader(mesh, mixer)
		display;}, 
	function (xhr) {
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
	}, function (error) {
		console.log(error);
	});

}
//very similar to seamstress loader but with cape model, again cannot be made generic due to specificity 
function capeLoader() {
	var gltfLoader = new GLTFLoader();

	var mainMaterial = new THREE.MeshToonMaterial();
	var capeMaterial = new THREE.MeshToonMaterial();
    var faceMaterial = new THREE.MeshToonMaterial();
    var eyesMaterial = new THREE.MeshToonMaterial();

	var faceTexture = new THREE.TextureLoader().load('models/textures/plane_face.png');
	faceTexture.flipY = false;
	
	var mainTexture = new THREE.TextureLoader().load('models/textures/fake_shading.png');
	mainTexture.flipY = false;

	var capeTexture = new THREE.TextureLoader().load('models/textures/cape.png');
	capeTexture.flipY = false;

    var eyesTexture = new THREE.TextureLoader().load('models/textures/eye_different.png');
	eyesTexture.flipY = false;

	mainMaterial.map = mainTexture;
	capeMaterial.map = capeTexture;
	faceMaterial.map = faceTexture;
    eyesMaterial.map = eyesTexture;
	gltfLoader.load("models/Sylv.glb", function(gltf) {

		gltf.scene.traverse(function(child) {

			if (child.isMesh) {
				var m = child;
				var n = m.material;
				if (n.name == "MAIN") {
					m.material = mainMaterial;
				}
				if (n.name == "FACE") {
					m.material = faceMaterial;
				}
				if (n.name == "CAPE") {
					m.material = capeMaterial;
				}
                if (n.name == "EYES") {
					m.material = eyesMaterial;
				}
			}
		});
		var mesh = gltf.scene;
		var display = meshLoader(mesh)
		display;
		console.log(mesh)
	}, function(xhr) {
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
	}, function(error) {
		console.log(error);
	});

}
var setAction = function (toAction) {
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

var animations = {
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

animationsFolder.open();
$(gui.domElement).attr("hidden", true)
document.getElementById("seamstress").addEventListener("click",function(){
	seamstress = true;
	cape = false;
	seamstressLoader();
	
})
document.getElementById("hood").addEventListener("click",function(){
	seamstress = false;
	cape = true;
	capeLoader();
})

