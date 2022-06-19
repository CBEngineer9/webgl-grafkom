var movementAmount = 0.02;
var sprintMovementAmount = 0.03;
var deltaMovement = movementAmount;
var deltaFOV = 1;
var initialFOV = 70;
var sprintFOV = 80;
var personHeight = 1.8;
var vAngle = 0;
/**
 *  {dictionary} movementKeyBinds,
 *  Index is the command string, and the value is an array filled with {char} keys that will trigger the command string. 
 */
var movementKeyBinds = {
  'up': ['w', 'arrowup'],
  'right': ['d', 'arrowright'],
  'down': ['s', 'arrowdown'],
  'left': ['a', 'arrowleft'],
  'sprint': 'shift',
}
var pressedKeys = {};

var FPSCollisionBox = new THREE.Box3();
var FPSCollisionBoxHelper;

/**
 * panggil fungsi ini untuk initialize FPS Controls
 * @param {Dom} domElement 
 * @param {THREE.Scene} scene 
 * @param {THREE.Camera} camera 
 */
function initFPSControls(domElement, scene, camera) {
  connectKey(domElement);
  camera.position.y = personHeight;
  initialFOV = camera.fov;
  sprintFOV = camera.fov + 10;
  updateCollisionBox();
  FPSCollisionBoxHelper = new THREE.Box3Helper( FPSCollisionBox );
  scene.add(FPSCollisionBoxHelper);
  //comment this to disable collision helper
  toggleFPSCollisionBoxHelper();
}

function toggleFPSCollisionBoxHelper() {
  FPSCollisionBoxHelper.visible = !FPSCollisionBoxHelper.visible;
}

function onKeyDown(event) {
  if (controls.isLocked) pressedKeys[event.key.toLowerCase()] = true;
}

function onKeyUp(event) {
  if (controls.isLocked) pressedKeys[event.key.toLowerCase()] = false;
}
/**
 * Check if player is currently sprinting.
 * @returns {Boolean} If currently sprinting.
 */
function isSprinting() {
  return pressedKeys[movementKeyBinds['sprint']] || false;
}

function isMoving() {
  let isMoving = false;
  for (const[key, value] of Object.entries(movementKeyBinds)) {
    if (key == 'sprint') continue;
    for (let i = 0; i < value.length; i++) {
      let item = value[i];
      isMoving = isMoving || pressedKeys[item];
      if (isMoving) return isMoving;
    }
  }
  return isMoving;
}

/**
 * Sprint
 * @param {Camera} camera 
 */
function sprint(camera) {
  if (!isSprinting()) {
    deltaMovement = movementAmount;
    if (camera.fov > initialFOV) camera.fov -= deltaFOV;
    camera.updateProjectionMatrix();
  }
  else if (isSprinting()){
    deltaMovement = sprintMovementAmount;
    if (camera.fov < sprintFOV) camera.fov += deltaFOV;
    camera.updateProjectionMatrix();
  }  
}
/**
 * Update the collision box of the camera.
 */
function updateCollisionBox() {
  FPSCollisionBox.setFromCenterAndSize( new THREE.Vector3(camera.position.x, camera.position.y - 0.9, camera.position.z), new THREE.Vector3( 0.7, 2, 0.7) );
}

/**
 *  Animate the controls movement.
 * fungsi ini dipanggil dalam fungsi animate().
 *  @param {THREE.Camera} camera THREE.Camera
 *  @param {THREE.PointerLockControls} controls THREE.PointerLockControls 
 *  @param {Array<THREE.Box3>} boxes Array of THREE.Box3 to check collision
 */
function animateControls(camera, controls, boxes) {
  move(pressedKeys, camera, controls, boxes);
  activateCameraBobbingWhenMoving()
}

/**
 * Movement Algorithm.
 * @param {Dictionary} pressedKeys Index = pressed key, value = Boolean.
 * @param {Camera} camera THREE.Camera.
 * @param {PointerLockControls} controls THREE.PointerLockControls.
 * @param {Array<Box3>} boxes Array of THREE.Box3 to check collision
 */
function move(pressedKeys, camera, controls, boxes) {
  // loop over movementKeyBinds
  for (const[key, value] of Object.entries(movementKeyBinds)) {
    if (key == 'sprint') sprint(camera);
    // loop over semua value
    // 'up': ['w', 'arrowup'],
    // key : [value1, value2]
    for (let i = 0; i < value.length; i++) {
      let item = value[i];
      if (!pressedKeys[item]) continue;
      let dForward = 0, dRight = 0;
      switch (key) {
        case 'up': dForward = deltaMovement; break;
        case 'right': dRight = deltaMovement; break;
        case 'down': dForward = -deltaMovement; break;
        case 'left': dRight = -deltaMovement; break;
      }
      controls.moveForward(dForward);
      controls.moveRight(dRight);
      updateCollisionBox();
      boxes.forEach(item => {
        if (FPSCollisionBox.intersectsBox(item)) {
          controls.moveForward(-dForward);
          controls.moveRight(-dRight);
        }
      });
    }
  }
}

function activateCameraBobbingWhenMoving() {
  let deltaNaikTurun = 1;
  if (isMoving()) {
    vAngle += deltaMovement * deltaNaikTurun;
    let bobbing = (Math.pow(Math.sin(vAngle), 2) - 1) * 1/8;
    camera.position.y = bobbing + personHeight;
  }
}

function disconnectKey(domElement){
  domElement.ownerDocument.removeEventListener('keydown', onKeyDown);
  domElement.ownerDocument.removeEventListener('keyup', onKeyUp);
}

function connectKey(domElement) {
  domElement.ownerDocument.addEventListener('keydown', onKeyDown);
  domElement.ownerDocument.addEventListener('keyup', onKeyUp);
}