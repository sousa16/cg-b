import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////


var camera, scene, renderer, aspectRatio, clock;
var activeCamera, frontCamera, sideCamera, topCamera, orthographicCamera, perspectiveCamera, mobileCamera;

var hookPositionWorld = new THREE.Vector3();
var topTower, topTowerGeometry, topTowerMesh;
var materials;
var crane, craneTower, trolley, hookAssembly;
var cube, dodecahedron, isocahedron, torus, torusKnot;
var ball, cubeBall, dodeBall, isoBall, torusBall, torusKnotBall;

var baseGeometry, baseMesh;
var lowerTowerGeometry, lowerTowerMesh;
var cabinGeometry, cabinMesh;
var sidesGeometry, sidesMesh;
var boomGeometry, boomMesh;
var counterBoomGeometry, counterBoomMesh;
var counterweightGeometry, counterweightMesh;
var hoistRopeGeometry, hoistRopeMesh;
var counterHoistRopeGeometry, counterHoistRopeMesh;

var trolleyGeometry, trolleyMesh;

var cableGeometry, cableMesh;
var hook, hookGeometry, hookMesh;
var hookToothGeometry, hookToothMesh, hookSphereGeometry, hookSphereMesh;

var ballGeometry, ballMesh;

var materials = {
    "dark grey": new THREE.MeshBasicMaterial({ color: 0x444745, wireframe: true }),
    "white": new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
    "yellow": new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true }),
    "red": new THREE.MeshBasicMaterial({ color: 0xd71b12, wireframe: true }),
    "pink": new THREE.MeshBasicMaterial({ color: 0xf757d7, wireframe: true }),
    "blue": new THREE.MeshBasicMaterial({ color: 0x0b0fd3, wireframe: true }),
    "orange": new THREE.MeshBasicMaterial({ color: 0xeb6900, wireframe: true }),
    "purple": new THREE.MeshBasicMaterial({ color: 0x9000eb, wireframe: true }),
    "dark green": new THREE.MeshBasicMaterial({ color: 0x257203, wireframe: true }),
    "dark green 1": new THREE.MeshBasicMaterial({ color: 0x206a00, wireframe: true }),
    "dark green 2": new THREE.MeshBasicMaterial({ color: 0x00450e, wireframe: true }),
    "pinkBall": new THREE.MeshBasicMaterial({ color: 0xf757d9, wireframe: true }),
    "redBall": new THREE.MeshBasicMaterial({ color: 0xd71b12, wireframe: true }),
    "transparent": new THREE.MeshBasicMaterial({ color: 0x87CEFA, opacity: 0.1, transparent: true }),
}

/////////////////////
/* Keyboard Inputs */
/////////////////////
var keys, numKeys;
var keyA = false;
var keyQ = false;

var keyW = false;
var keyS = false;

var keyE = false;
var keyD = false;

var keyR = false;
var keyF = false;

var activeKey = 1;
var prevKey = 1;
var key7 = false;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));

    createCrane(0, 1, 0);


    createContainer(0, 0, 50);
    createCubeLoad(30, 10, 50);
    createDodecahedronLoad(25, 10, 30);
    createIcosahedronLoad(50, 5.9, 10);
    createTorusLoad(60, 6, 65);
    createTorusKnotLoad(70, 9.5, 40);


}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';

    aspectRatio = window.innerWidth / window.innerHeight;

    // Frontal camera
    frontCamera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
    frontCamera.position.z = 100;

    // Side camera
    sideCamera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
    sideCamera.position.x = 100;

    // Top camera
    topCamera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
    topCamera.position.y = 100;

    // Orthographic camera
    orthographicCamera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
    orthographicCamera.position.set(100, 100, 100); // Position it off the main axes

    // Perspective camera
    perspectiveCamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    perspectiveCamera.position.set(100, 100, 100); // Position it off the main axes

    // Mobile perspective camera
    mobileCamera = new THREE.PerspectiveCamera(100, aspectRatio, 0.1, 1000);
    hook.add(mobileCamera);
    mobileCamera.position.set(0, -4, 0);

    activeCamera = frontCamera;

    // Make sure they're pointing towards the scene
    frontCamera.lookAt(scene.position);
    sideCamera.lookAt(scene.position);
    topCamera.lookAt(scene.position);
    orthographicCamera.lookAt(scene.position);
    perspectiveCamera.lookAt(scene.position);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////


function createCrane(x, y, z) {
    'use strict';

    crane = new THREE.Object3D();

    createCraneBase(crane, x, y, z);
    createCraneTower(crane, x, y, z);

    scene.add(crane);

    crane.position.x = x;
    crane.position.y = y;
    crane.position.z = z;
}

// Crane base definitions
function createCraneBase(obj, x, y, z) {
    'use strict';

    baseGeometry = new THREE.BoxGeometry(10, 2, 10);
    baseMesh = new THREE.Mesh(baseGeometry, materials["dark grey"]);

    baseMesh.position.set(x, y, z);

    obj.add(baseMesh);
}

// Crane tower definitions
function createCraneTower(obj, x, y, z) {
    'use strict';
    craneTower = new THREE.Object3D();

    createLowerTower(craneTower, x, y + 31, z);
    createTopTower(craneTower, x, y, z);
    createPeak(craneTower, x, y, z);

    obj.add(craneTower);
}

function createLowerTower(obj, x, y, z) {
    'use strict';

    lowerTowerGeometry = new THREE.BoxGeometry(5, 60, 5);
    lowerTowerMesh = new THREE.Mesh(lowerTowerGeometry, materials["yellow"]);

    lowerTowerMesh.position.set(x, y, z);

    obj.add(lowerTowerMesh);
}

function createPeak(obj, x, y, z) {
    'use strict';

    // Create a cylinder for the sides of the pyramid
    sidesGeometry = new THREE.CylinderGeometry(0, 5 / Math.sqrt(2), 10, 4);
    sidesMesh = new THREE.Mesh(sidesGeometry, materials["yellow"]);

    sidesMesh.rotation.y = Math.PI / 4;

    sidesMesh.position.set(x, y + 69, z);

    obj.add(sidesMesh);
}

function createTopTower(obj, x, y, z) {
    'use strict';

    topTower = new THREE.Object3D();
    topTower.position.set(x, y + 62.5, z);

    topTowerGeometry = new THREE.BoxGeometry(5, 3, 5);
    topTowerMesh = new THREE.Mesh(topTowerGeometry, materials["yellow"]);
    topTower.add(topTowerMesh);
    createBoom(topTower, x, 0, 0);
    createCounterBoom(topTower, x, 0, 0);
    createCabin(topTower, x, 0, 0);
    createCounterWeight(topTower, x, 0, 0);
    createHoistRope(topTower, x, 0, 0);
    createCounterHoistRope(topTower, x, 0, 0);
    createTrolley(topTower, x, 0, 0);
    obj.add(topTower);

}

function createBoom(obj, x, y, z) {
    'use strict';

    boomGeometry = new THREE.BoxGeometry(5, 50, 3);
    boomMesh = new THREE.Mesh(boomGeometry, materials["yellow"]);

    boomMesh.rotation.x = (Math.PI / 2);
    boomMesh.rotation.z = 3 * (Math.PI / 2);

    boomMesh.position.set(x + 27.5, y, z);


    obj.add(boomMesh);
}

function createCounterBoom(obj, x, y, z) {
    'use strict';

    counterBoomGeometry = new THREE.BoxGeometry(5, 20, 3);
    counterBoomMesh = new THREE.Mesh(counterBoomGeometry, materials["yellow"]);

    counterBoomMesh.rotation.x = (Math.PI / 2);
    counterBoomMesh.rotation.z = (Math.PI / 2);

    counterBoomMesh.position.set(x - 12.5, y, z);

    obj.add(counterBoomMesh);
}

function createCabin(obj, x, y, z) {
    'use strict';

    cabinGeometry = new THREE.BoxGeometry(5, 3, 3);
    cabinMesh = new THREE.Mesh(cabinGeometry, materials["dark grey"]);

    cabinMesh.position.set(x, y, z + 4);

    obj.add(cabinMesh);
}

function createCounterWeight(obj, x, y, z) {
    'use strict';

    counterweightGeometry = new THREE.BoxGeometry(5, 3, 5);
    counterweightMesh = new THREE.Mesh(counterweightGeometry, materials["dark grey"]);

    counterweightMesh.position.set(x - 19, -3, 0);

    obj.add(counterweightMesh);
}

function createHoistRope(obj, x, y, z) {
    'use strict';

    hoistRopeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 40, 32);
    hoistRopeMesh = new THREE.Mesh(hoistRopeGeometry, materials["dark grey"]);

    hoistRopeMesh.rotation.z = 1.7 * (Math.PI / 4);

    hoistRopeMesh.position.set(x + 20, 6.25, z);

    obj.add(hoistRopeMesh);
}

function createCounterHoistRope(obj, x, y, z) {
    'use strict';

    counterHoistRopeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 32);
    counterHoistRopeMesh = new THREE.Mesh(counterHoistRopeGeometry, materials["dark grey"]);

    counterHoistRopeMesh.rotation.y = Math.PI;
    counterHoistRopeMesh.rotation.z = 1.35 * (Math.PI / 4);

    counterHoistRopeMesh.position.set(x - 9.3, 6.25, 0);

    obj.add(counterHoistRopeMesh);
}

function createTrolley(obj, x, y, z) {
    'use strict';

    trolley = new THREE.Object3D();
    trolley.position.set(50.5, -3, 0);
    trolleyGeometry = new THREE.BoxGeometry(3, 3, 3);
    trolleyMesh = new THREE.Mesh(trolleyGeometry, materials["dark grey"]);
    trolley.add(trolleyMesh);

    createCable(trolley, 0, -1.5, 0);
    createHook(trolley, 0, -13, 0);

    obj.add(trolley);
}

function createCable(obj, x, y, z) {
    'use strict';

    cableGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 32);
    cableMesh = new THREE.Mesh(cableGeometry, materials["dark grey"]);

    cableMesh.position.set(x, y - 5, z);

    obj.add(cableMesh);
}

function createHook(obj, x, y, z) {
    'use strict';
    hook = new THREE.Object3D();
    hookGeometry = new THREE.BoxGeometry(3, 3, 3);
    hookMesh = new THREE.Mesh(hookGeometry, materials["dark grey"]);
    hook.position.set(x, y, z);
    hook.add(hookMesh);
    hookMesh.position.set(0, 0, 0);

    createHookTooth(hook, -1, -2.5, 1.5, 3 * Math.PI / 4);
    createHookTooth(hook, -1, -2.5, -1.5, -3 * Math.PI / 4);
    createHookTooth(hook, 1, -2.5, 1.5, Math.PI / 4);
    createHookTooth(hook, 1, -2.5, -1.5, -Math.PI / 4);

    obj.add(hook);
}


function createHookTooth(obj, x, y, z, angle) {
    'use strict';
    hookToothGeometry = new THREE.ConeGeometry(.5, 2, 5, 1, false, angle, 2 * Math.PI);
    hookToothMesh = new THREE.Mesh(hookToothGeometry, materials["red"]);
    hookSphereGeometry = new THREE.SphereGeometry(.5, 32, 16, 0, Math.PI * 2, 4.8946013542929, Math.PI);
    hookSphereMesh = new THREE.Mesh(hookSphereGeometry, materials["red"]);
    hookSphereMesh.position.set(x, y + 0.5, z);
    hookToothMesh.position.set(x, y - 0.5, z);
    hookToothMesh.rotation.x = Math.PI;
    obj.add(hookToothMesh);
    obj.add(hookSphereMesh);
}
/*========================= CREATE OBJECT CONTAINER===================================*/

function addContainerBase(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.BoxGeometry(20, 0, 35);
    var mesh = new THREE.Mesh(geometry, materials["dark green 2"]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}
function addContainerBigWall(obj, x, y, z) {
    'use strict';


    var geometry = new THREE.BoxGeometry(4, 20, 35);
    var mesh = new THREE.Mesh(geometry, materials["dark green"]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addContainerSmallWall(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.BoxGeometry(28, 20, 4);
    var mesh = new THREE.Mesh(geometry, materials["dark green 1"]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createContainer(x, y, z) {
    'use strict';

    var container = new THREE.Object3D();

    addContainerBase(container, 0, 0, 0);
    addContainerBigWall(container, 12, 10, 0);
    addContainerBigWall(container, -12, 10, 0);
    addContainerSmallWall(container, 0, 10, 19.5);
    addContainerSmallWall(container, 0, 10, -19.5);

    scene.add(container);

    container.position.x = x;
    container.position.y = y;
    container.position.z = z;
}

/*========================= CREATE OBJECT LOADS===================================*/
function createCubeLoad(x, y, z) {
    'use strict';

    cube = new THREE.Object3D();

    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var mesh = new THREE.Mesh(geometry, materials["red"]);

    cube.add(mesh);
    cube.position.set(x, y / 2, z);

    scene.add(cube);
}
function createDodecahedronLoad(x, y, z) {
    'use strict';

    dodecahedron = new THREE.Object3D();

    var geometry = new THREE.DodecahedronGeometry(5);
    var mesh = new THREE.Mesh(geometry, materials["blue"]);

    dodecahedron.add(mesh)
    dodecahedron.position.set(x, y / 2, z);


    scene.add(dodecahedron);
}
function createIcosahedronLoad(x, y, z) {
    'use strict';

    isocahedron = new THREE.Object3D();

    var geometry = new THREE.IcosahedronGeometry(7);
    var mesh = new THREE.Mesh(geometry, materials["orange"]);

    isocahedron.add(mesh);
    isocahedron.position.set(x, y, z);
    scene.add(isocahedron);
}
function createTorusLoad(x, y, z) {
    'use strict';

    torus = new THREE.Object3D();

    var geometry = new THREE.TorusGeometry(4, 2);
    var mesh = new THREE.Mesh(geometry, materials["pink"]);

    torus.add(mesh);
    torus.position.set(x, y, z);
    scene.add(torus);
}
function createTorusKnotLoad(x, y, z) {
    'use strict';

    torusKnot = new THREE.Object3D();

    var geometry = new THREE.TorusKnotGeometry(6, 1, 64, 8, 2, 3);
    var mesh = new THREE.Mesh(geometry, materials["purple"]);

    torusKnot.add(mesh);
    torusKnot.position.set(x, y, z);
    scene.add(torusKnot);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
    'use strict';
    if (checkSphereCollision(ball, cubeBall, 2, 6) == true) {
        ball.children[0].material.color.setHex(0xff0000);

    }
    else if (checkSphereCollision(ball, dodeBall, 2, 5.5) == true) {
        ball.children[0].material.color.setHex(0xff0000);
    }
    else if (checkSphereCollision(ball, isoBall, 2, 7) == true) {
        ball.children[0].material.color.setHex(0xff0000);
    }
    else if (checkSphereCollision(ball, torusBall, 2, 6) == true) {
        ball.children[0].material.color.setHex(0xff0000);
    }
    else if (checkSphereCollision(ball, torusKnotBall, 2, 10) == true) {
        ball.children[0].material.color.setHex(0xff0000);
    }
    else {
        ball.children[0].material.color.setHex(0xf757d9);
    }

}

function checkSphereCollision(sphere1, sphere2, radius1, radius2) {
    'use strict';
    var center1 = sphere1.position.clone();
    var center2 = sphere2.position.clone();

    var distance = center1.distanceTo(center2);

    if (distance < radius1 + radius2) {
        return true;
    } else {
        return false;
    }
}



///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
    'use strict';

}

////////////
/* UPDATE */
////////////
function update() {
    'use strict';
    var delta = clock.getDelta();
    if (keyA) {
        rotateCraneY(-1, delta);
        document.getElementById("A").style.backgroundColor = "grey";
    } else {
        document.getElementById("A").style.backgroundColor = "";
    }
    if (keyQ) {
        rotateCraneY(1, delta);
        document.getElementById("Q").style.backgroundColor = "grey";
    } else {
        document.getElementById("Q").style.backgroundColor = "";
    }
    if (keyW) {
        moveTrolley(1, delta);
        document.getElementById("W").style.backgroundColor = "grey";
    } else {
        document.getElementById("W").style.backgroundColor = "";
    }
    if (keyS) {
        moveTrolley(-1, delta);
        document.getElementById("S").style.backgroundColor = "grey";
    } else {
        document.getElementById("S").style.backgroundColor = "";
    }
    if (keyE) {
        moveHook(1, delta);
        document.getElementById("E").style.backgroundColor = "grey";
    } else {
        document.getElementById("E").style.backgroundColor = "";
    }
    if (keyD) {
        moveHook(-1, delta);
        document.getElementById("D").style.backgroundColor = "grey";
    } else {
        document.getElementById("D").style.backgroundColor = "";
    }
    if (keyR) {
        hookOpenAngle(1, delta); // OPEN
        document.getElementById("R").style.backgroundColor = "grey";
    } else {
        document.getElementById("R").style.backgroundColor = "";
    }
    if (keyF) {
        hookOpenAngle(-1, delta); // CLOSE
        document.getElementById("F").style.backgroundColor = "grey";
    } else {
        document.getElementById("F").style.backgroundColor = "";
    }

    if (key7) {
        document.getElementById("7").style.backgroundColor = "grey";
    }
    else {
        document.getElementById("7").style.backgroundColor = "";
    }

    document.getElementById(numKeys[prevKey - 1]).style.backgroundColor = "";
    document.getElementById(numKeys[activeKey - 1]).style.backgroundColor = "grey";
    hook.getWorldPosition(hookPositionWorld);
    mobileCamera.lookAt(hookPositionWorld.x, 0, hookPositionWorld.z);
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, activeCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0xd3d3d3); // light gray color
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    clock = new THREE.Clock();

    createScene();
    createCamera();
    createHUD();

    render();

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    requestAnimationFrame(animate);

    update();

    render();
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

//////////////////////////////
/* CRANE MOVEMENT FUNCTIONS */
//////////////////////////////

function rotateCraneY(direction, delta) {
    topTower.rotation.y += direction * 0.1 * delta;
}

function moveTrolley(direction, delta) {
    if (trolley.position.x >= 50 && direction == 1 || trolley.position.x <= 5 && direction == -1) {
        return;
    } else {
        trolley.position.x += direction * 5 * delta;
    }
}

function moveHook(direction, delta) {
    if (cableMesh.scale.y <= 0.1 && direction == 1 || cableMesh.scale.y >= 5.5 && direction == -1) {
        return;
    } else {
        hook.position.y += (direction * delta * 8);
        cableMesh.position.y += (direction * delta * 4);
        cableMesh.scale.y += ((-1) * direction * delta) / 1.25;
    }
}

function hookOpenAngle(direction, delta) {
    if ((hook.children[1].rotation.z >= (Math.PI / 8) && direction == 1) || (hook.children[1].rotation.z < -1 * Math.PI / 6 && direction == -1)) {
        return;
    } else {
        var coeficient = direction * delta;

        hook.children[1].rotation.z += coeficient * Math.PI / 4;
        hook.children[1].rotation.x -= coeficient * Math.PI / 4;
        hook.children[1].position.x -= direction * 1 * delta;
        hook.children[1].position.z += direction * 1 * delta;
        hook.children[2].rotation.z += coeficient * Math.PI / 4;
        hook.children[2].rotation.x -= coeficient * Math.PI / 4;

        hook.children[3].rotation.z -= -1 * coeficient * Math.PI / 4;
        hook.children[3].rotation.x -= -1 * coeficient * Math.PI / 4;
        hook.children[3].position.x -= direction * 1 * delta;
        hook.children[3].position.z -= direction * 1 * delta;
        hook.children[4].rotation.z -= -1 * coeficient * Math.PI / 4;
        hook.children[4].rotation.x -= -1 * coeficient * Math.PI / 4;

        hook.children[5].rotation.z += -1 * coeficient * Math.PI / 4;
        hook.children[5].rotation.x += -1 * coeficient * Math.PI / 4;
        hook.children[5].position.x += direction * 1 * delta;
        hook.children[5].position.z += direction * 1 * delta;
        hook.children[6].rotation.z += -1 * coeficient * Math.PI / 4;
        hook.children[6].rotation.x += -1 * coeficient * Math.PI / 4;

        hook.children[7].rotation.z += -1 * coeficient * Math.PI / 4;
        hook.children[7].rotation.x -= -1 * coeficient * Math.PI / 4;
        hook.children[7].position.x -= -1 * direction * 1 * delta;
        hook.children[7].position.z += -1 * direction * 1 * delta;
        hook.children[8].rotation.z += -1 * coeficient * Math.PI / 4;
        hook.children[8].rotation.x -= -1 * coeficient * Math.PI / 4;

    }
}

////////////////
/* CREATE HUD */
////////////////
function createHUD() {
    // Create HUD element
    var hudElement = document.createElement('div');
    hudElement.setAttribute('id', 'hud');
    document.body.appendChild(hudElement);

    var numKeysRow = document.createElement('div');
    numKeysRow.setAttribute('id', 'numKeysRow');
    hudElement.appendChild(numKeysRow);

    numKeys = ['1', '2', '3', '4', '5', '6', '7'];
    keys = ['Q', 'A', 'W', 'S', 'E', 'D', 'R', 'F'];

    var keyRow1 = document.createElement('div');
    var keyRow2 = document.createElement('div');
    hudElement.appendChild(keyRow1);
    hudElement.appendChild(keyRow2);

    var keyElement;
    for (let index = 0; index < 7; index++) {
        keyElement = document.createElement('span');
        keyElement.setAttribute('id', numKeys[index]);
        keyElement.innerHTML = numKeys[index];
        numKeysRow.appendChild(keyElement);
    }

    for (let index = 0; index < 8; index += 2) {
        keyElement = document.createElement('span');
        keyElement.setAttribute('id', keys[index]);
        keyElement.innerHTML = keys[index];
        keyRow1.appendChild(keyElement);
    }
    for (let index = 1; index < 8; index += 2) {
        keyElement = document.createElement('span');
        keyElement.setAttribute('id', keys[index]);
        keyElement.innerHTML = keys[index];
        keyRow2.appendChild(keyElement);
    }
}
///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    switch (e.keyCode) {
        case 49: //1
            activeCamera = frontCamera;
            prevKey = activeKey;
            activeKey = 1;
            break;
        case 50: //2
            activeCamera = sideCamera;
            prevKey = activeKey;
            activeKey = 2;
            break;
        case 51: //3
            activeCamera = topCamera;
            prevKey = activeKey;
            activeKey = 3;
            break;
        case 52: //4
            activeCamera = orthographicCamera;
            prevKey = activeKey;
            activeKey = 4;
            break;
        case 53: //5
            activeCamera = perspectiveCamera;
            prevKey = activeKey;
            activeKey = 5;
            break;
        case 54: //6
            activeCamera = mobileCamera;
            prevKey = activeKey;
            activeKey = 6;
            break;
        case 55: //7

            for (var key in materials) {
                if (materials.hasOwnProperty(key)) {
                    materials[key].wireframe = !materials[key].wireframe;
                }
            }
            if (key7) {
                key7 = false;
            } else {
                key7 = true;
            }
            break;
        case 81: // q for crane rotation
            keyQ = true;
            break;
        case 65: // a for negative crane rotation
            keyA = true;
            break;
        case 87: // w for trolley movement
            keyW = true;
            break;
        case 83: // s for trolley movement
            keyS = true;
            break;
        case 69: // e for hook movement
            keyE = true;
            break;
        case 68: // d for hook movement
            keyD = true;
            break;
        case 70: // f for hook open/close
            keyF = true;
            break;
        case 82: // r for hook open/close
            keyR = true;
            break;
        /*
        //Debug para as colisoes
        case 38: // Seta para cima
            ball.position.z -= 1; // Aumenta a posição em 1 unidade no eixo y
            break;
        case 40: // Seta para baixo
            ball.position.z += 1; // Diminui a posição em 1 unidade no eixo y
            break;
        case 39: // Seta para direita
            ball.position.x += 1; // Aumenta a posição em 1 unidade no eixo x
            break;
        case 37: // Seta para esquerda
            ball.position.x -= 1; // Diminui a posição em 1 unidade no eixo x
            break;
        case 79: // o
            ball.position.y += 1;
            break;
        case 80: // Seta para esquerda
            ball.position.y -= 1;
            break;
        */

    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict';
    switch (e.keyCode) {
        case 81: // q for crane rotation
            keyQ = false;
            break;
        case 65: // a for negative crane rotation
            keyA = false;
            break;
        case 87: // w for trolley movement
            keyW = false;
            break;
        case 83: // s for trolley movement
            keyS = false;
            break;
        case 69: // e for hook movement
            keyE = false;
            break;
        case 68: // d for hook movement
            keyD = false;
            break;
        case 70: // f for hook open/close
            keyF = false;
            break;
        case 82: // r for hook open/close
            keyR = false;
            break;
    }
}

init();
animate();
