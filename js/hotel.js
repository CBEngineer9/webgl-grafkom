
function CreateRotationAnimation(period, axis = 'x') {

  const times = [0, period], values = [0, 360];

  const trackName = '.rotation[' + axis + ']';

  const track = new NumberKeyframeTrack(trackName, times, values);

  return new AnimationClip(null, period, [track]);

}

var collisionBoxes = [];

function addCollisionChecking(obj, boxes) {
  // console.log('obj:',obj); 
  // console.log('typeof(obj):',typeof(obj));
  
  if (obj.children.length == 0) {
    boxes.push(new THREE.Box3().setFromObject(obj));
    scene.add(new THREE.Box3Helper( new THREE.Box3().setFromObject(obj), 0xeeeeee ));
  }
  else {
    obj.children.forEach(child => {
      addCollisionChecking(child, boxes);
    });
  }
}

function loadModels() {

  loader.load(
    "./room/room.gltf",
    // "./coba2/models/table/scene.gltf",
    // model loaded
    function (gltf) {

      gltf.animations; // Array<THREE.AnimationClip>
      object = gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object

      console.log(gltf.scene);

      // const doorlight = new THREE.PointLight( 0xffff55, 10, 100 );
      // doorlight.position.set( -5, 5, -10 );
      // scene.add( doorlight );
      // const sphereSize = 1;
      // const pointLightHelper = new THREE.PointLightHelper( doorlight, sphereSize );
      // scene.add( pointLightHelper );

      // const clips = gltf.animations;
      // mixer = new THREE.AnimationMixer(gltf.scene)
      // const action = mixer.clipAction(clips[0])
      // action.reset().play()

      // boxes.push(new THREE.Box3().setFromObject(gltf.scene));
      // gltf.scene.scale.set(0.3, 0.3, 0.3);
      // addCollisionChecking(gltf.scene, collisionBoxes);
      scene.add(gltf.scene);  

    },

    // model loading
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
      console.log('An error happened');
    }
  );

  // loader.load(
  //     "./doorAlone/door.gltf",
  //     // model loaded
  //     function(gltf){

  //         gltf.animations; // Array<THREE.AnimationClip>
  //         object = gltf.scene; // THREE.Group
  //         gltf.scenes; // Array<THREE.Group>
  //         gltf.cameras; // Array<THREE.Camera>
  //         gltf.asset; // Object

  //         console.log(gltf.scene);

  //         // const doorlight = new THREE.PointLight( 0xffff55, 10, 100 );
  //         // doorlight.position.set( -5, 5, -10 );
  //         // scene.add( doorlight );
  //         // const sphereSize = 1;
  //         // const pointLightHelper = new THREE.PointLightHelper( doorlight, sphereSize );
  //         // scene.add( pointLightHelper );

  //         const clips = gltf.animations;
  //         const mixerDoor = new THREE.AnimationMixer(gltf.scene)
  //         const action = mixerDoor.clipAction(clips[0])
  //         action.reset().play()

  //         scene.add(gltf.scene);
  //         mixers.push(mixerDoor)

  //         animate();
  //     },

  //     // model loading
  //     function(xhr){
  //         console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  //     },
  //     // called when loading has errors
  //     function ( error ) {
  //         console.log( 'An error happened' );
  //     }
  // );
}

// on resize
window.addEventListener('resize', onWindowResize);



// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(-6, 1.8, -6);
// camera.lookAt( 0, 0, 0 );

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// light
const light = new THREE.PointLight(0xffff55, 10, 100);
light.position.set(-5, 5, 0);
// scene.add( light );

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
scene.add(pointLightHelper);

const whiteAmbient = new THREE.AmbientLight(0x808080, 5); // white ambient
scene.add(whiteAmbient);

// spotlight 1
const spotLight = new THREE.SpotLight(0xffffcc);
spotLight.position.set(-1, 2.0, 1.9);
spotLight.castShadow = true;
scene.add(spotLight);

spotLight.target.position.set(-1, 5, 1.9);
scene.add(spotLight.target);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
spotLightHelper.update();
scene.add(spotLightHelper);

// clock
const clock = new THREE.Clock();

// control
// const controls = new THREE.OrbitControls(camera, renderer.domElement);
var controls = new THREE.PointerLockControls(camera, document.body);
// controls.maxPolarAngle = Math.PI * 5 / 6;
// controls.minPolarAngle = Math.PI * 1 / 6;

var menu = document.getElementById('menu');
document.body.addEventListener('click', function(e) {
  if (!controls.isLocked) controls.lock();
});

controls.addEventListener( 'lock', function() {
  menu.style.display = 'none';
  setTimeout(animate, 1);
});

controls.addEventListener( 'unlock', function() {
	menu.style.display = 'flex';
});

// loader
const loader = new THREE.GLTFLoader();

const mixers = [];

var animationMixer;

//init raycasting
var raycaster = new THREE.Raycaster();
var pointer = new THREE.Vector2();
var objectHoverHelper;
var hoveredObject;
// var objectHoverHelper = new THREE.Box3Helper( new THREE.Box3().setFromObject(mesh), 0xffff00 );
// set pointer location to center of the window
pointer.x = 0;
pointer.y = 0;
function raycasting() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  scene.remove(scene.getObjectByName("objectHoverHelper"));
  hoveredObject = null;
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name == "objectHoverHelper") continue;
    // if (intersects[i].object.name != "hoverable") continue;
    objectHoverHelper = new THREE.Box3Helper( new THREE.Box3().setFromObject(intersects[i].object), 0xeeeeee );
    objectHoverHelper.name = "objectHoverHelper";
    hoveredObject = intersects[i];
    scene.add(objectHoverHelper);
    break;
  }
}

// Load obj
loadModels()

function animate() {
  if (controls.isLocked) requestAnimationFrame( animate );
  for (const mixer of mixers) mixer.update(delta);
  raycasting();
  animateControls(camera, controls, collisionBoxes);
  activateCameraBobbingWhenMoving();
  spotLightHelper.update();
  renderer.render(scene, camera);
}
initFPSControls(document.body, camera);
animate();

function traverseUntilLastParent(obj) {
  if (obj.parent == scene) return obj;
  else {
    return traverseUntilLastParent(obj.parent);
  }
}

function animateObject(obj) {
  animationMixer = new THREE.AnimationMixer(obj);
  animationMixer.addEventListener('finished', stopAllAnimation)
  var animation = animationMixer.clipAction(obj.animations[0]);
  animation.timeScale = 1;
  animation.setLoop(THREE.LoopOnce);
  animation.clampWhenFinished = true;
  animation.enable = true;
  animation.reset();
  animation.play();
}

function stopAllAnimation() {
  animationMixer.stopAllAction();
  let tempRoot = animationMixer.getRoot();
  let tempClips = tempRoot.animations;
  for (let i = 0; i < tempClips.length; i++) {
    let tempClip = tempClips[i];
    animationMixer.uncacheClip(tempClip);
    animationMixer.uncacheAction(tempClip, tempRoot);
  }
  animationMixer.uncacheRoot(tempRoot);
  animationMixer = null;
}

document.body.addEventListener('click', function(e) {
  if (!controls.isLocked || hoveredObject == null) return;
  if (animationMixer != null)stopAllAnimation();
  let lastObj = traverseUntilLastParent(hoveredObject.object);
  console.log('lastObj:',lastObj);
  if (lastObj.animations.length > 0) animateObject(lastObj);
})

// on resize
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
