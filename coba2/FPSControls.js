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

function updateCollisionBox() {
  FPSCollisionBox.setFromCenterAndSize( new THREE.Vector3(camera.position.x, camera.position.y - 0.9, camera.position.z), new THREE.Vector3( 1, 2, 1 ) );
}

/**
 *  Animate the controls movement
 *  @param {Camera} camera 
 */
function animateControls(camera, controls, boxes) {
  move(pressedKeys, camera, controls);
  
}


function move(pressedKeys, camera, controls) {
  for (const[key, value] of Object.entries(movementKeyBinds)) {
    if (key == 'sprint') sprint(camera);
    for (let i = 0; i < value.length; i++) {
      let item = value[i];
      if (!pressedKeys[item]) continue;
      try {
        switch (key) {
          case 'up':
            controls.moveForward(deltaMovement);
            updateCollisionBox();
            boxes.forEach(item => {
              if (FPSCollisionBox.intersectsBox(item)) {
                controls.moveForward(-deltaMovement);
                // throw "collision!";
                console.log('up collision');
              }
            });
            break;
          case 'right':
            controls.moveRight(deltaMovement);
            updateCollisionBox();
            boxes.forEach(item => {
              if (FPSCollisionBox.intersectsBox(item)) {
                controls.moveRight(-deltaMovement);
                // throw "collision!";
              }
            });
            break;
          case 'down':
            controls.moveForward(-deltaMovement);
            updateCollisionBox();
            boxes.forEach(item => {
              if (FPSCollisionBox.intersectsBox(item)) {
                controls.moveForward(deltaMovement);
                // throw "collision!";
              }
            });
            break;
          case 'left':
            controls.moveRight(-deltaMovement);
            updateCollisionBox();
            boxes.forEach(item => {
              if (FPSCollisionBox.intersectsBox(item)) {
                controls.moveRight(deltaMovement);
                // throw "collision!";
              }
            });
            break;
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  }
}

function moveForwardTemp ( distance, vectorAwal ) {

  // move forward parallel to the xz-plane
  // assumes camera.up is y-up
  _vector.setFromMatrixColumn( camera.matrix, 0 );

  _vector.crossVectors( camera.up, _vector );

  camera.position.addScaledVector( _vector, distance );

};

function moveRightTemp ( distance, vectorAwal ) {

  _vector.setFromMatrixColumn( camera.matrix, 0 );

  camera.position.addScaledVector( _vector, distance );

};