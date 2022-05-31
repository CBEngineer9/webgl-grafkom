
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
// camera.position.set( -1, 2, -1 );
// camera.lookAt( 0, 0, 0 );

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// mixers array
const mixers = [];

// light
const letThereBeLight = new THREE.PointLight( 0xffff55, 10, 100 );
letThereBeLight.position.set( -5, 5, 0 );
// scene.add( letThereBeLight );
const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( letThereBeLight, sphereSize );
scene.add( pointLightHelper );

const whiteAmbient = new THREE.AmbientLight( 0x808080 , 2); // white ambient
scene.add( whiteAmbient );

// spotlight 1
// const spotLight = new THREE.SpotLight( 0xffffcc );
// spotLight.position.set( -1, 2.0, 1.9 );
// spotLight.castShadow = true;
// scene.add( spotLight );

// spotLight.target.position.set(-1, 5, 1.9);
// scene.add( spotLight.target );

// const spotLightHelper = new THREE.SpotLightHelper( spotLight );
// spotLightHelper.update();
// scene.add( spotLightHelper );

// front light
const frontLight = new THREE.PointLight( 0xffffcc, 2, 50, 2 );
frontLight.position.set( -1, 2.0, 1.8 );
frontLight.castShadow = true;
scene.add( frontLight );
const frontLightHelper = new THREE.PointLightHelper( frontLight, 0.1 );
scene.add( frontLightHelper );

console.log('smolLight:',frontLight);

//Set up shadow properties for the light
frontLight.shadow.mapSize.width = 2048; // default
frontLight.shadow.mapSize.height = 2048; // default
frontLight.shadow.camera.near = 0.5; // default
frontLight.shadow.camera.far = 100; // default
frontLight.shadow.bias = -0.001;

//Create a helper for the shadow camera (optional)
const frontLightShadowHelper = new THREE.CameraHelper( frontLight.shadow.camera );
scene.add( frontLightShadowHelper );

// corridor light
const corridorLight = new THREE.PointLight( 0xffffcc, 1, 50, 2 );
corridorLight.position.set( 3.7, 2, -4.5 );
corridorLight.castShadow = true;
scene.add( corridorLight );
const corridorLightHelper = new THREE.PointLightHelper( corridorLight, 0.1 );
scene.add( corridorLightHelper );

//Set up shadow properties for the light
corridorLight.shadow.mapSize.width = 2048; // default
corridorLight.shadow.mapSize.height = 2048; // default
corridorLight.shadow.camera.near = 0.5; // default
corridorLight.shadow.camera.far = 100; // default
corridorLight.shadow.bias = -0.001;

//Create a helper for the shadow camera (optional)
const corridorLightShadowHelper = new THREE.CameraHelper( frontLight.shadow.camera );
scene.add( corridorLightShadowHelper );

// light flicker
// const timesArr = [0, 2.5, 3, 4.1, 4.3, 4.5, 5];
// const valuesArr = [0, 0.2, 0, 0.1, 0, 0.5, 0];
// const flickerKFrame = new THREE.NumberKeyframeTrack('.intensity',timesArr,valuesArr, THREE.InterpolateDiscrete);
// const flickerClip = new THREE.AnimationClip(null,5,[flickerKFrame]);
// const corridorFlickerMixer = new THREE.AnimationMixer(corridorLight);
// const action = corridorFlickerMixer.clipAction(flickerClip);
// action.setLoop(THREE.LoopRepeat, Infinity)
// action.play();
// console.log('flickerClip:',flickerClip);
// console.log('action:',action);
// mixers.push(corridorFlickerMixer);

function corridorFlicker() {
    if (Math.random() < 0.8) {
        corridorLight.intensity = 0;
    } else 
        corridorLight.intensity = Math.random()

    setTimeout(corridorFlicker, Math.random() * 5000);
}
corridorFlicker()

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

// camera path
const path = new THREE.Path();

path.lineTo( 0, 0.8 );
path.quadraticCurveTo( 0, 1, 0.2, 1 );
path.lineTo( 1, 1 );

function showPathHelper(path) {
    const points = path.getPoints();
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
    const line = new THREE.Line( geometry, material );
    scene.add( line );
}
showPathHelper(path);

// loader
const loader = new THREE.GLTFLoader();

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
  for ( const mixer of mixers ) mixer.update( clock.getDelta() );
  raycasting();
  animateControls(camera, controls, collisionBoxes);
  activateCameraBobbingWhenMoving();
//   spotLightHelper.update();
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
