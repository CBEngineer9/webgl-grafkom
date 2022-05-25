var movementAmount = 0.05;
var sprintMovementAmount = 0.08;
var deltaMovement = movementAmount;
var initialFOV = 75;
var sprintFOV = 80;
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

function initFPSControls(domElement, camera) {
  domElement.onkeydown = onKeyDown;
  domElement.onkeyup = onKeyUp;
  initialFOV = camera.fov;
  sprintFOV = camera.fov + 10;
  FPSCollisionBox.setFromCenterAndSize( new THREE.Vector3(camera.position.x, camera.position.y - 0.9, camera.position.z), new THREE.Vector3( 1, 2, 1 ) );
}

function onKeyDown(event) {
  let key = event.key;
  pressedKeys[key.toLowerCase()] = true;
}

function onKeyUp(event) {
  pressedKeys[event.key.toLowerCase()] = false;
}
/**
 * Check if player is currently sprinting.
 * @returns {Boolean} If currently sprinting.
 */
function isSprinting() {
  return pressedKeys[movementKeyBinds['sprint']] || false;
}

/**
 * Sprint
 * @param {Camera} camera 
 */
function sprint(camera) {
  if (!isSprinting()) {
    deltaMovement = movementAmount;
    if (camera.fov > initialFOV) camera.fov -= 0.5;
    camera.updateProjectionMatrix();
  }
  else if (isSprinting()){
    deltaMovement = sprintMovementAmount;
    if (camera.fov < sprintFOV) camera.fov += 0.5;
    camera.updateProjectionMatrix();
  }  
}
/**
 * Update the collision box of the camera.
 */
function updateCollisionBox() {
  FPSCollisionBox.setFromCenterAndSize( new THREE.Vector3(camera.position.x, camera.position.y - 0.9, camera.position.z), new THREE.Vector3( 1, 2, 1 ) );
}

/**
 *  Animate the controls movement.
 *  @param {Camera} camera 
 *  @param {PointerLockControl} controls 
 *  @param {Array<Box3>} boxes 
 */
function animateControls(camera, controls, boxes) {
  move(pressedKeys, camera, controls);
}

/**
 * Movement Algorithm.
 * @param {Dictionary} pressedKeys Index = pressed key, value = Boolean.
 * @param {Camera} camera THREE.Camera.
 * @param {PointerLockControls} controls THREE.PointerLockControls.
 */
function move(pressedKeys, camera, controls) {
  for (const[key, value] of Object.entries(movementKeyBinds)) {
    if (key == 'sprint') sprint(camera);
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