var movementAmount = 0.05;
var sprintMovementAmount = 0.08;
var deltaMovement = movementAmount;
var initialFOV = 75;
var sprintFOV = 80;
// var vAngle = 0;
/**
 *  {dictionary} movementKeyBinds,
 *  Index is the command string, and the value is an array filled with {char} keys that will trigger the command string. 
 */
var movementKeyBinds = {
  'up': ['w', 'arrowup'],
  'right': ['d', 'arrowright'],
  'down': ['s', 'arrowdown'],
  'left': ['a', 'arrowleft'],
  // 'jump': ' ',
  // 'crouch': 'control',
  'sprint': 'shift',
}
var pressedKeys = {};

function initFPSControls(domElement, camera) {
  domElement.onkeydown = onKeyDown;
  domElement.onkeyup = onKeyUp;
  initialFOV = camera.fov;
  sprintFOV = camera.fov + 10;
}

function onKeyDown(event) {
  let key = event.key;
  pressedKeys[key.toLowerCase()] = true;
  
  // console.log('onkeydown', event);
  // console.log('pressedKeys:',pressedKeys);
}

function onKeyUp(event) {
  pressedKeys[event.key.toLowerCase()] = false;
  // console.log('onkeyup', event);
}

// function jump(speed, camera) {
//   vAngle += speed;
//   camera.position.y = Math.sin(vAngle) + 1.38;
// }

function isSprinting() {
  return pressedKeys[movementKeyBinds['sprint']] || false;
}

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
  // console.log('isSprinting():',isSprinting())
  // console.log('camera.fov:',camera.fov)
  
}


/**
 *  Animate the controls movement
 *  @param {Camera} camera 
 */
function animateControls(camera) {
  move(pressedKeys, camera);
}


function move(pressedKeys, camera) {
  for (const[key, value] of Object.entries(movementKeyBinds)) {
    if (key == 'sprint') sprint(camera);
    for (let i = 0; i < value.length; i++) {
      let item = value[i];
      if (!pressedKeys[item]) continue;
      switch (key) {
        case 'up':
          controls.moveForward(deltaMovement);
          break;
        case 'right':
          controls.moveRight(deltaMovement);
          break;
        case 'down':
          controls.moveForward(-deltaMovement);
          break;
        case 'left':
          controls.moveRight(-deltaMovement);
          break;
        // case 'jump':
        //   break;
        // case 'crouch':
        //   break;
      }
    }
  }
}