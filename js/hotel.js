
function CreateRotationAnimation(period, axis = 'x') {

  const times = [0, period], values = [0, 360];

  const trackName = '.rotation[' + axis + ']';

  const track = new NumberKeyframeTrack(trackName, times, values);

  return new AnimationClip(null, period, [track]);

}

var collisionBoxes = [];

// collision checking
function addCollisionChecking(obj, boxes, isSimple = false) {
  if (!isSimple) {
    const hleper = new THREE.BoxHelper(obj, 0xeeeeee )
    console.log('hleper:',hleper);
    scene.add(hleper);

    if (obj.children.length == 0 && obj.isMesh) {
      // const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
      // const colObj = new THREE.Mesh(obj.geometry, material)
      // obj.add(colObj)

      obj.geometry.computeBoundingBox()
      obj.geometry.computeBoundingSphere()

      // const box = new THREE.Box3().setFromObject(obj)
      // boxes.push(box);

    }
    else {
      obj.children.forEach(child => {
        addCollisionChecking(child, boxes);
      });
    }
  }
  else {
    boxes.push(new THREE.Box3().setFromObject(obj));
    //biar bisa liat mana yang tidak bisa dilewati untuk debug
    // scene.add(new THREE.Box3Helper( new THREE.Box3().setFromObject(obj), 0xeeeeee ));
  }
}

// traverse through children and give name
function traverseThroughChildrenAndGiveName(obj, name) {
  obj.name = name;
  if (obj.children.length != 0) {
    obj.children.forEach(child => {
      traverseThroughChildrenAndGiveName(child, name)
    });
  }
}

const doorAction = []
var action_woman;

function loadModels() {

  loader.load(
    "./room/frontRoom.gltf",
    // "./coba2/models/table/scene.gltf",
    // model loaded
    function (gltf) {

      gltf.animations; // Array<THREE.AnimationClip>
      object = gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object

      gltf.scene.castShadow = true;
      gltf.scene.receiveShadow = true;
      
      gltf.scene.traverse( function ( child ) {
        if ( child.isObject3D ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      } );

      console.log(gltf.scene);

      // const clips = gltf.animations;
      // mixer = new THREE.AnimationMixer(gltf.scene)
      // const action = mixer.clipAction(clips[0])
      // action.reset().play()

      // const bb = new THREE.BoxHelper( object, 0xeeeeee );
      // scene.add(bb)

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

  loader.load(
      "./doorAlone/door.gltf",
      // model loaded
      function(gltf){

          gltf.animations; // Array<THREE.AnimationClip>
          object = gltf.scene; // THREE.Group
          gltf.scenes; // Array<THREE.Group>
          gltf.cameras; // Array<THREE.Camera>
          gltf.asset; // Object

          console.log(gltf.scene);

          object.position.z = -9.11
          object.position.y = 0.05

          object.rotation.y = Math.PI;

          // const doorlight = new THREE.PointLight( 0xffff55, 10, 100 );
          // doorlight.position.set( -5, 5, -10 );
          // scene.add( doorlight );
          // const sphereSize = 1;
          // const pointLightHelper = new THREE.PointLightHelper( doorlight, sphereSize );
          // scene.add( pointLightHelper );

          // const door = gltf.scene.getObjectByName('hoverable')
          
          // door.raycast = function(raycaster,intersects){
          //   console.log(intersects);
          //   intersects.forEach(itx => {
          //     // console.log(itx.object);
          //     if (itx.object.uuid == door.uuid) {
          //       console.log('ha');
          //     }
          //   });
          // }

          // TODO : make separate function
          const clips = gltf.animations;
          const mixerDoor = new THREE.AnimationMixer(gltf.scene)
          const action = mixerDoor.clipAction(clips[0])
          action.setLoop(THREE.LoopOnce)
          action.clampWhenFinished = true;
          doorAction.push(action)
          mixers.push(mixerDoor)
          // action.reset().play()

          const action_close = mixerDoor.clipAction(clips[0].clone())
          action_close.setLoop(THREE.LoopOnce)
          action_close.timeScale = -1;
          action.time = clips[0].duration;
          doorAction.push(action_close)

          // const timesArr = [0, 5];
          // const valuesArr = [20.0, 0.1];
          
          // const farKFrame = new THREE.NumberKeyframeTrack('.fog.far',timesArr,valuesArr, THREE.InterpolateLinear);
          // const fogClip = new THREE.AnimationClip(null,timesArr[timesArr.length-1],[farKFrame]);
          // const fogAction = sceneMixer.clipAction(fogClip);
          // fogAction.setLoop(THREE.LoopPingPong,Infinity)
          // fogAction.reset().play()

          // mixerDoor.addEventListener( 'finished', function( e ) { 
          //   doorAction[0].timeScale = -1;
          //   doorAction[0].play();
          // } );

          
          scene.add(gltf.scene);
      },

      // model loading
      function(xhr){
          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      // called when loading has errors
      function ( error ) {
          console.log( 'An error happened' );
      }
  );

  loader.load(
    './woman/scene.gltf',
    function (gltf) {
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object

      // traverseThroughChildrenAndGiveName(gltf.scene, "hoverable");
      
      gltf.scene.rotation.y = -Math.PI * 0.4;
      gltf.scene.position.set(0.1, 0, -0.65);
      gltf.scene.scale.set(0.0111, 0.0111, 0.0111);
      gltf.scene.children[0].name = "hoverable_woman";
      console.log('gltf.scene:',gltf.scene);
      console.log(dumpObject(gltf.scene));

      // const geometry = new THREE.SphereGeometry( 32, 32, 16 );
      // const geometry = new THREE.BoxGeometry( 0.7, 1.7, 0.7 );
      const geometry = new THREE.BoxGeometry( 70, 160, 70 );
      const material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
      const sphere = new THREE.Mesh( geometry, material );
      sphere.position.set(0, 100, 0)
      sphere.name = 'hoverable_woman';
      gltf.scene.add( sphere );

      gltf.scene.animations = gltf.animations;
      const clips = gltf.animations;
      const mixerWoman = new THREE.AnimationMixer(gltf.scene)
      action_woman = mixerWoman.clipAction(clips[0])
      mixers.push(mixerWoman)

      // addCollisionChecking(gltf.scene, collisionBoxes, true);
      scene.add( gltf.scene );
    },
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
      console.log( 'An error happened' );
    }
  );
  
  loader.load(
    './coba2/models/table/scene.gltf',
    function (gltf) {
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object

      traverseThroughChildrenAndGiveName(gltf.scene, "hoverable");
      
      gltf.scene.rotation.y = Math.PI / 2;
      gltf.scene.animations = gltf.animations;
      gltf.scene.position.set(-0.65, 0, -0.65);
      gltf.scene.scale.set(0.25, 0.25, 0.25);
      // gltf.scene.name = "hoverable";
      console.log('gltf.scene:',gltf.scene);

      addCollisionChecking(gltf.scene, collisionBoxes, true);
      scene.add( gltf.scene );
      animate();
    },
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
      console.log( 'An error happened' );
    }
  );

}

function loadGhost(callback){
  loader.load(
    './ghost1/scene.gltf',
    function (gltf) {
      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
      
      // gltf.scene.rotation.y = Math.PI / 2;
      // gltf.scene.animations = gltf.animations;
      gltf.scene.position.set(-2.32, 0, -6.23);
      // gltf.scene.scale.set(0.25, 0.25, 0.25);
      gltf.scene.name = "ghost"
      console.log('loaded:',gltf.scene);

      scene.add( gltf.scene );

      callback();
    },
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
      console.log( 'An error happened' );
    }
  );
}

// on resize
window.addEventListener('resize', onWindowResize);

// mixers array
const mixers = [];

// scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000,0.1,20)
const sceneMixer = new THREE.AnimationMixer(scene);
mixers.push(sceneMixer);

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set( -3, 2, 0 );
camera.lookAt( 0, 1.8, 0 );

// mixer for camera
const cameraMixer = new THREE.AnimationMixer(camera);
mixers.push(cameraMixer);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// post processing composer
const composer = new THREE.EffectComposer( renderer );

const width = window.innerWidth;
const height = window.innerHeight;
const ssaoPass = new THREE.SSAOPass( scene, camera, width, height );
ssaoPass.kernelRadius = 8;
composer.addPass( ssaoPass );

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
const frontLight = new THREE.PointLight( 0xffffcc, 1.5, 50, 2 );
frontLight.position.set( -1, 2.0, 1.8 );
frontLight.castShadow = true;
scene.add( frontLight );
const frontLightHelper = new THREE.PointLightHelper( frontLight, 0.1 );
scene.add( frontLightHelper );

//Set up shadow properties for the light
frontLight.shadow.mapSize.width = 2048; // default
frontLight.shadow.mapSize.height = 2048; // default
frontLight.shadow.camera.near = 0.5; // default
frontLight.shadow.camera.far = 100; // default
frontLight.shadow.bias = -0.001;

//Create a helper for the shadow camera (optional)
// const frontLightShadowHelper = new THREE.CameraHelper( frontLight.shadow.camera );
// scene.add( frontLightShadowHelper );

// corridor light
const corridorLight = new THREE.PointLight( 0xffffcc, 0.5, 50, 2 );
corridorLight.position.set( 3.7, 2, -4.5 );
corridorLight.castShadow = true;
scene.add( corridorLight );
const corridorLightHelper = new THREE.PointLightHelper( corridorLight, 0.1 );
scene.add( corridorLightHelper );

//Set up shadow properties for the light
corridorLight.shadow.mapSize.width = 2048;
corridorLight.shadow.mapSize.height = 2048;
corridorLight.shadow.camera.near = 0.5; 
corridorLight.shadow.camera.far = 100;
corridorLight.shadow.bias = -0.001;

//Create a helper for the shadow camera (optional)
// const corridorLightShadowHelper = new THREE.CameraHelper( corridorLight.shadow.camera );
// scene.add( corridorLightShadowHelper );

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
var cinematicMode = false;
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
const path = new THREE.CurvePath();
path.add(new THREE.LineCurve3(new THREE.Vector3(-3,1.8,0), new THREE.Vector3(-1,1.8,0)))
path.add(new THREE.CubicBezierCurve3(new THREE.Vector3(-1,1.8,0), new THREE.Vector3(0,1.8,0), new THREE.Vector3(4,1.8,2.7), new THREE.Vector3(3.2,1.8,-1.3)))
path.add(new THREE.CatmullRomCurve3([new THREE.Vector3(3.2,1.8,-1.3), new THREE.Vector3(2.5,1,-6.2), new THREE.Vector3(3,1.8,-8), new THREE.Vector3(1.4,1.8,-8.7)]))

function showPathHelper(path) {
  const points = path.getPoints();
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
  const line = new THREE.Line( geometry, material );
  scene.add( line );
}
// showPathHelper(path);

function cinematicMove(path) {
  const points = path.getPoints();
  const timesArr = [];
  const valuesArr = [];
  for (let i = 0; i < points.length; i++) {
    const element = points[i];
    timesArr.push(i);
    
    valuesArr.push(element.x);
    valuesArr.push(element.y);
    valuesArr.push(element.z);
  }
  
  const cn_posKFrame = new THREE.VectorKeyframeTrack('.position',timesArr,valuesArr, THREE.InterpolateLinear);
  const cinematicClip = new THREE.AnimationClip(null,timesArr[timesArr.length-1],[cn_posKFrame]);
  const action = cameraMixer.clipAction(cinematicClip);
  action.play();
}
// cinematicMove(path)

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
  // console.log('intersects:',intersects);
  scene.remove(scene.getObjectByName("objectHoverHelper"));
  hoveredObject = null;
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name == "objectHoverHelper") continue;
    if (
      !intersects[i].object.name.startsWith("hoverable")
    ) continue;
    objectHoverHelper = new THREE.Box3Helper( new THREE.Box3().setFromObject(intersects[i].object), 0xeeeeee );
    objectHoverHelper.name = "objectHoverHelper";
    hoveredObject = intersects[i];
    // console.log('hoveredObject:',hoveredObject);
    scene.add(objectHoverHelper);
    break;
  }
}

// loader
const loader = new THREE.GLTFLoader();

var animationMixer; // TODO: clean this mixer

// Load obj
loadModels();

// Load wall for collision checking
let wall = new THREE.Mesh( new THREE.BoxGeometry(10, 3, 0), new THREE.MeshStandardMaterial( { color: 0x00ff00 } ) );
wall.position.set(0, 1, 2);
addCollisionChecking(wall, collisionBoxes, true);
// scene.add(wall);

wall = new THREE.Mesh( new THREE.BoxGeometry(6, 3, 0), new THREE.MeshStandardMaterial( { color: 0x00ff00 } ) );
wall.position.set(-1, 1, -1.85);
addCollisionChecking(wall, collisionBoxes, true);
// scene.add(wall);

wall = new THREE.Mesh( new THREE.BoxGeometry(2, 3, 0), new THREE.MeshStandardMaterial( { color: 0x00ff00 } ) );
wall.position.set(1.2, 1, -7.85);
addCollisionChecking(wall, collisionBoxes, true);
// scene.add(wall);

wall = new THREE.Mesh( new THREE.BoxGeometry(6, 3, 0), new THREE.MeshStandardMaterial( { color: 0x00ff00 } ) );
wall.position.set(1.2, 1, -9.45);
addCollisionChecking(wall, collisionBoxes, true);
// scene.add(wall);

wall = new THREE.Mesh( new THREE.BoxGeometry(10, 3, 0), new THREE.MeshStandardMaterial( { color: 0x00ff00 } ) );
wall.position.set(-3.72, 1, 0);
wall.rotation.y = 90 * Math.PI / 180
addCollisionChecking(wall, collisionBoxes, true);
// scene.add(wall);

wall = new THREE.Mesh( new THREE.BoxGeometry(15, 3, 0), new THREE.MeshStandardMaterial( { color: 0x00ff00 } ) );
wall.position.set(3.90, 1, -4.5);
wall.rotation.y = 90 * Math.PI / 180
addCollisionChecking(wall, collisionBoxes, true);
// scene.add(wall);

wall = new THREE.Mesh( new THREE.BoxGeometry(6, 3, 0), new THREE.MeshStandardMaterial( { color: 0x00ff00 } ) );
wall.position.set(2.28, 1, -4.85);
wall.rotation.y = 90 * Math.PI / 180
addCollisionChecking(wall, collisionBoxes, true);
// scene.add(wall);

wall = new THREE.Mesh( new THREE.BoxGeometry(2.5, 3, 0), new THREE.MeshStandardMaterial( { color: 0x00ff00 } ) );
wall.position.set(0, 1, -8.71);
wall.rotation.y = 90 * Math.PI / 180
addCollisionChecking(wall, collisionBoxes, true);
// scene.add(wall);

// ----- Story -------
var story_state = 0
// 0: init
// 1: checked in
// 2: looked at keyhole 1
// 3: rested
// 4: looked at keyhole 2
// 5: talked to woman (end)

function animate() {
  if (controls.isLocked) requestAnimationFrame( animate );
  const delta = clock.getDelta();
  for ( const mixer of mixers ) mixer.update( delta );
  raycasting();
  animateControls(camera, controls, collisionBoxes);
  activateCameraBobbingWhenMoving();
//   spotLightHelper.update();
  updateDebugScreen()
  renderer.render(scene, camera);
  // composer.render();
}
initFPSControls(document.body, scene, camera);
// animate();


// Function land /////////////////////////////////////////////////////////////

function peepKeyhole(time) {
  const campos = camera.position;
  const apexpos = new THREE.Vector3(3, 0.975, -6.27);
  const keypos = new THREE.Vector3(2.24, 0.975, -6.27);

  // const points = path.getPoints();
  const timesArr = [0, 2, 4, 6];
  const valuesArr = [];

  // for (let i = 0; i < points.length; i++) {
  //   const element = points[i];
  //   timesArr.push(i);
    
  //   valuesArr.push(element.x);
  //   valuesArr.push(element.y);
  //   valuesArr.push(element.z);
  // }
  campos.toArray(valuesArr,valuesArr.length)
  apexpos.toArray(valuesArr,valuesArr.length)
  keypos.toArray(valuesArr,valuesArr.length)
  keypos.toArray(valuesArr,valuesArr.length) // to hold
  
  const kh_posKFrame = new THREE.VectorKeyframeTrack('.position',timesArr,valuesArr, THREE.InterpolateLinear);
  const keyholeClip = new THREE.AnimationClip(null,timesArr[timesArr.length-1],[kh_posKFrame]);
  const action = cameraMixer.clipAction(keyholeClip);
  mixers.push(cameraMixer);
  action.setLoop(THREE.LoopPingPong, 2)

  if (time == 2) {
    // red
    const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x880808 } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = 2.11065
    mesh.position.y = 1
    mesh.position.z = -6.25
    mesh.name = 'red'
    scene.add( mesh );
  }

  cameraMixer.addEventListener( 'finished', function( e ) { 
    if (time == 1){
      scene.remove(scene.getObjectByName('ghost'));
      showDialog("A woman? Who is she? a celebrity? The owner's daughter?","white")

    } else if (time == 2){
      scene.remove(scene.getObjectByName('red'));
      showDialog("What was that red stuff? I should talk to the owner about this.", "white")
    }
  } ); // properties of e: type, action and direction

  action.reset().play();
  console.log('playing');
}

function traverseUntilLastParent(obj) {
  if (obj.parent == scene) return obj;
  else {
    return traverseUntilLastParent(obj.parent);
  }
}

function traverseUntilHoverable(obj) {
  if (obj.parent == scene || obj.name.startsWith('hoverable')) return obj;
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

function showDialog(text, color) {
  const dialogBox = document.getElementById('dialog')
  dialogBox.textContent = text
  dialogBox.style.color = color;
  dialogBox.classList.remove('fadeout');
  dialogBox.offsetWidth;
  dialogBox.classList.add('fadeout');
}

function changeScene() {
  // Trigger animation
  var div = document.getElementById("curtain");
  div.classList.remove("screen-change");
  div.offsetWidth;
  div.classList.add("screen-change");
 
  // Trigger scene change
  setTimeout(function() {
      // Your real code should go here. I've added something
      // just to demonstrate the change

  }, 1000);
};

// let exposition_mode = false;
let intro = false; // TODO: cut for memory?
let introTicker = 0;
let outro = false; // TODO: cut for memory?
let outroTicker = 0;
document.body.addEventListener('click', function(e) {
  if (intro){
    const dialogBox = document.getElementById('dialog')
    if (introTicker == 0){
      dialogBox.textContent = "Yes. Room for 1 please."
      dialogBox.style.color = "white";
    } else if (introTicker == 1) {
      dialogBox.textContent = "Sure. Here is your key. Your room is at the second room on the left of the hallway. By the way, the first room on the left is the store room. You ABSELUTELY cannot enter that room. Okay?"
      dialogBox.style.color = "pink";
    } else if (introTicker == 2) {
      dialogBox.textContent = "Uhh... Okay"
      dialogBox.style.color = "white";
    } else if (introTicker == 3) {
      dialogBox.textContent = "Superb. Have a nice rest";
      dialogBox.style.color = "pink";
    } else if (introTicker == 4) {
      // dialogBox.textContent = "Thank you";
      // dialogBox.style.color = "white";

      dialogBox.style.opacity = 0;
      dialogBox.classList.remove('fadeout');
      dialogBox.offsetWidth;
      dialogBox.classList.add('fadeout');
      introTicker = 0;
      intro = false;
      story_state = 1;
      controls.connect();
      connectKey(document.body);
    }
    introTicker++;
  } else if (outro) {
    const dialogBox = document.getElementById('dialog')
    if (outroTicker == 0){
      dialogBox.textContent = "Sigh. Did you look through the keyhole?"
      dialogBox.style.color = "pink";
    } else if (outroTicker == 1) {
      dialogBox.textContent = "Yeah.. sorry"
      dialogBox.style.color = "white";
    } else if (outroTicker == 2) {
      dialogBox.textContent = "Well, I might as well tell you the story of what happened in that room.";
      dialogBox.style.color = "pink";
    } else if (outroTicker == 3) {
      dialogBox.textContent = "A long time ago, a man murdered his wife in there, and we find that even now, whoever stays there gets very uncomfortable.";
      dialogBox.style.color = "pink";
    } else if (outroTicker == 4) {
      dialogBox.textContent = "But these people were not ordinary.";
      dialogBox.style.color = "pink";
    } else if (outroTicker == 5) {
      dialogBox.textContent = "They were white all over, except for their eyes, which were red.";
      dialogBox.style.color = "pink";
    } else if (outroTicker == 6) {
      dialogBox.style.opacity = 0;
      dialogBox.classList.remove('fadeout');
      dialogBox.offsetWidth;
      dialogBox.classList.add('fadeout');
      outroTicker = 0;
      outro = false;
      story_state = 5;
      controls.connect();
      connectKey(document.body);
    } 
    outroTicker++;
  } else {
    if (!controls.isLocked || hoveredObject == null) return;
    // if (animationMixer != null)stopAllAnimation();
    let lastObj = traverseUntilHoverable(hoveredObject.object);
    if (lastObj.name == 'hoverable_doorBody') {
      if (story_state == 2) {
        doorAction[0].reset().play();
        setTimeout(() => {
  
          changeScene()
  
          setTimeout(() => {
            doorAction[0].reset()
            doorAction[0].stop()
  
            doorAction[1].stop()
            // doorAction[1].timeScale = -1
            doorAction[1].time = doorAction[1].getClip().duration;
            doorAction[1].play();
  
            showDialog("Well, that was a good night sleep. I should head out now","white")
          }, 5000);
        }, 1000);
        
        story_state = 3
      } else if (story_state < 2) {
        showDialog("I can't sleep while thinking about what that lady said. I should investigate","white")
      } else {
        showDialog("I have slept already. I should head out now","white")
      }
    } else if (lastObj.name == 'hoverable_woman') {
      console.log('lastObj:',lastObj);
      if (story_state == 0) {
        action_woman.reset().play()
  
        controls.disconnect();
        disconnectKey(document.body)// Prevent movement
        
        const dialogBox = document.getElementById('dialog')
        dialogBox.textContent = "Welcome to Hotel Harem Samgun, would you like to check in?"
        dialogBox.style.color = "pink";
        dialogBox.style.opacity = 0.7;
        intro = true;
      } else if (story_state == 4) {
        controls.disconnect();
        disconnectKey(document.body)// Prevent movement
        
        const dialogBox = document.getElementById('dialog')
        dialogBox.textContent = "Umm, sorry but what was that store room about?"
        dialogBox.style.color = "white";
        dialogBox.style.opacity = 0.7;
        outro = true;
      } else {
        showDialog("I shouldn't bother her again", "white")
      }
  
    } else {
      if (story_state == 1) {
        loadGhost(function(){
          peepKeyhole(1);
          story_state = 2
        });
      } else if (story_state == 3) {
        peepKeyhole(2);
        story_state = 4
      }
    }
    // if (lastObj.animations.length > 0) animateObject(lastObj);
  }
})

// on resize
window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateDebugScreen() {
  document.getElementById('pos_x').innerText = "x=" + camera.position.x;
  document.getElementById('pos_y').innerText = "y=" + camera.position.y;
  document.getElementById('pos_z').innerText = "z=" + camera.position.z;
}

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}