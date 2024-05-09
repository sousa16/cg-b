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

var materials;
var crane, lowerCrane, upperCrane, trolleyAssembly, hookAssembly, hook;
var cube, dodecahedron, isocahedron, torus, torusKnot;

var baseGeometry, baseMesh;
var towerGeometry, towerMesh;

var topTowerGeometry, topTowerMesh;
var cabinGeometry, cabinMesh;
var basePeakGeometry, basePeakMesh;
var sidesGeometry, sidesMesh;
var boomGeometry, boomMesh;
var counterBoomGeometry, counterBoomMesh;
var counterweightGeometry, counterweightMesh;
var hoistRopeGeometry, hoistRopeMesh;
var counterHoistRopeGeometry, counterHoistRopeMesh;

var trolleyGeometry, trolleyMesh;

var cableGeometry, cableMesh;
var hookGeometry, hookMesh;
var hookToothGeometry, hookToothMesh;


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
    createCubeLoad(30, 10, 45);
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
    mobileCamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    mobileCamera.position.set(50, 23.5, 0); // Position it at the hook

    activeCamera = frontCamera;

    // Make sure they're pointing towards the scene
    frontCamera.lookAt(scene.position);
    sideCamera.lookAt(scene.position);
    topCamera.lookAt(scene.position);
    orthographicCamera.lookAt(scene.position);
    perspectiveCamera.lookAt(scene.position);
    mobileCamera.lookAt(new THREE.Vector3(mobileCamera.position.x, 0, mobileCamera.position.z)); // Orient it to look directly over the xOz plane
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

// Lower crane definitions
function createCraneBase(obj, x, y, z) {
    'use strict';

    baseGeometry = new THREE.BoxGeometry(10, 2, 10);
    baseMesh = new THREE.Mesh(baseGeometry, materials["dark grey"]);

    baseMesh.position.set(x, y, z);

    obj.add(baseMesh);
}

function createCraneTower(obj, x, y, z) {
    'use strict';

    towerGeometry = new THREE.BoxGeometry(5, 60, 5);
    towerMesh = new THREE.Mesh(towerGeometry, materials["yellow"]);

    towerMesh.position.set(x, y, z);

    obj.add(towerMesh);
}

function createLowerCrane(obj, x, y, z) {
    'use strict';
    lowerCrane = new THREE.Object3D();

    createCraneBase(lowerCrane, x, y, z);
    createCraneTower(lowerCrane, x, y + 31, z);


	obj.add(lowerCrane);
}

// Upper crane definitions
function createTopTower(obj, x, y, z) {
    'use strict';

    topTowerGeometry = new THREE.BoxGeometry(5, 3, 5);
    topTowerMesh = new THREE.Mesh(topTowerGeometry, materials["yellow"]);

    topTowerMesh.position.set(x, y - 10, z);

    obj.add(topTowerMesh);
}
function createPeak(obj, x, y, z) {

    'use strict';

    // Create a box for the base of the pyramid
    basePeakGeometry = new THREE.BoxGeometry(5, 0.1, 5);
    basePeakMesh = new THREE.Mesh(basePeakGeometry, materials["yellow"]);

    basePeakMesh.position.set(x, y - 8.5, z);

    obj.add(basePeakMesh);

    // Create a cylinder for the sides of the pyramid
    sidesGeometry = new THREE.CylinderGeometry(0, 5 / Math.sqrt(2), 10, 4);
    sidesMesh = new THREE.Mesh(sidesGeometry, materials["yellow"]);

    sidesMesh.rotation.y = Math.PI / 4;

    sidesMesh.position.set(x, y - 3.5, z);

    obj.add(sidesMesh);
}

function createCabin(obj, x, y, z) {
    'use strict';

    cabinGeometry = new THREE.BoxGeometry(5, 3, 3);
    cabinMesh = new THREE.Mesh(cabinGeometry, materials["transparent"]);

    cabinMesh.position.set(x, y - 10, z + 4);

    obj.add(cabinMesh);
}

function createBoom(obj, x, y, z) {
    'use strict';

    boomGeometry = new THREE.BoxGeometry(5, 50, 3);
    boomMesh = new THREE.Mesh(boomGeometry, materials["yellow"]);

    boomMesh.rotation.x = (Math.PI / 2);
    boomMesh.rotation.z = 3 * (Math.PI / 2);

    boomMesh.position.set(x + 27.5, y - 10, z);


    obj.add(boomMesh);
}

function createCounterBoom(obj, x, y, z) {
    'use strict';

    counterBoomGeometry = new THREE.BoxGeometry(5, 20, 3);
    counterBoomMesh = new THREE.Mesh(counterBoomGeometry, materials["yellow"]);

    counterBoomMesh.rotation.x = (Math.PI / 2);
    counterBoomMesh.rotation.z = (Math.PI / 2);

    counterBoomMesh.position.set(x - 12.5, y - 10, z);

    obj.add(counterBoomMesh);
}

function createCounterWeight(obj, x, y, z) {
    'use strict';

    counterweightGeometry = new THREE.BoxGeometry(3, 3, 5);
    counterweightMesh = new THREE.Mesh(counterweightGeometry, materials["dark grey"]);

    counterweightMesh.position.set(x - 21, y - 13, z);

    obj.add(counterweightMesh);
}

function createHoistRope(obj, x, y, z) {
    'use strict';

    hoistRopeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 40, 32);
    hoistRopeMesh = new THREE.Mesh(hoistRopeGeometry, materials["dark grey"]);

    hoistRopeMesh.rotation.z = 1.7 * (Math.PI / 4);

    hoistRopeMesh.position.set(x + 20, y - 3.6, z);

    obj.add(hoistRopeMesh);
}

function createCounterHoistRope(obj, x, y, z) {
    'use strict';

    counterHoistRopeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 32);
    counterHoistRopeMesh = new THREE.Mesh(counterHoistRopeGeometry, materials["dark grey"]);

    counterHoistRopeMesh.rotation.y = Math.PI;
    counterHoistRopeMesh.rotation.z = 1.35 * (Math.PI / 4);

    counterHoistRopeMesh.position.set(x - 9.3, y - 3.7, z);

    obj.add(counterHoistRopeMesh);
}

function createCable(obj, x, y, z) {
    'use strict';

    cableGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 32);
    cableMesh = new THREE.Mesh(cableGeometry, materials["dark grey"]);

    cableMesh.position.set(x + 50, y - 18.25, z);

    obj.add(cableMesh);
}

function createHook(obj, x, y, z) {
    'use strict';

	hook = new THREE.Object3D();

    hookGeometry = new THREE.BoxGeometry(1, 1, 1);
    hookMesh = new THREE.Mesh(hookGeometry, materials["dark grey"]);

	hook.add(hookMesh);
    hook.position.set(x + 50, y - 23.5, z);
    obj.add(hook);
}

function createHookTooth(obj, x, y, z) {
    'use strict';

    hookToothGeometry = new THREE.TetrahedronGeometry(0.5);
    hookToothMesh = new THREE.Mesh(hookToothGeometry, materials["dark grey"]);

    hookToothMesh.rotation.z = Math.PI;

    hookToothMesh.position.set(x + 50, y - 24, z);

    obj.add(hookToothMesh);
}

function createHookAssembly(obj, x, y, z) {
    'use strict';

    hookAssembly = new THREE.Object3D();

    createCable(hookAssembly, x, y, z);
    createHook(hookAssembly, x, y, z);
    createHookTooth(hookAssembly, x - 0.5, y, z - 0.5);
    createHookTooth(hookAssembly, x - 0.5, y, z + 0.5);
    createHookTooth(hookAssembly, x + 0.5, y, z - 0.5);
    createHookTooth(hookAssembly, x + 0.5, y, z + 0.5);



    obj.add(hookAssembly);
}

// Hook and cart function definitions
function createTrolley(obj, x, y, z) {
    'use strict';

    trolleyGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    trolleyMesh = new THREE.Mesh(trolleyGeometry, materials["dark grey"]);

    trolleyMesh.position.set(x + 50, y - 12.5, z);

    obj.add(trolleyMesh);

}

function createTrolleyAssembly(obj, x, y, z) {
    'use strict';
    trolleyAssembly = new THREE.Object3D();

    createTrolley(trolleyAssembly, x, y, z);
    createHookAssembly(trolleyAssembly, x, y, z);

    obj.add(trolleyAssembly);
}

function createUpperCrane(obj, x, y, z) {
    'use strict';
    upperCrane = new THREE.Object3D();

    createTopTower(upperCrane, x, y, z);
    createPeak(upperCrane, x, y, z);
    createCabin(upperCrane, x, y, z);
    createBoom(upperCrane, x, y, z);
    createCounterBoom(upperCrane, x, y, z);
    createCounterWeight(upperCrane, x, y, z);
    createHoistRope(upperCrane, x, y, z);
    createCounterHoistRope(upperCrane, x, y, z);

    createTrolleyAssembly(upperCrane, x, y, z);


	upperCrane.add(new THREE.AxesHelper(30));

	obj.add(upperCrane);
}

function createCrane(x, y, z) {
    'use strict';

    crane = new THREE.Object3D();

    createLowerCrane(crane, 0, 0, 0);
    createUpperCrane(crane, 0, 72, 0);

    crane.add(lowerCrane);
    crane.add(upperCrane);


    scene.add(crane);


    crane.position.x = x;
    crane.position.y = y;
    crane.position.z = z;
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
function createCubeLoad(x, y, z){
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
    isocahedron.position.set(x, y , z);
    scene.add(isocahedron);
}
function createTorusLoad(x, y, z) {
    'use strict';

	torus = new THREE.Object3D();

    var geometry = new THREE.TorusGeometry(4, 2);
    var mesh = new THREE.Mesh(geometry, materials["pink"]);

	torus.add(mesh);
    torus.position.set(x, y , z);
    scene.add(torus);
}
function createTorusKnotLoad(x, y, z) {
    'use strict';

	torusKnot = new THREE.Object3D();

    var geometry = new THREE.TorusKnotGeometry(6, 1, 64, 8, 2, 3);
    var mesh = new THREE.Mesh(geometry, materials["purple"]);

	torusKnot.add(mesh);
    torusKnot.position.set(x, y , z);
    scene.add(torusKnot);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
/*
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
*/
function checkCollisions(sphere1, sphere2, radius1, radius2) {
	'use strict';
    var x1 = sphere1.position.x;
    var y1 = sphere1.position.y;
    var z1 = sphere1.position.z;

    var x2 = sphere2.position.x;
    var y2 = sphere2.position.y;
    var z2 = sphere2.position.z;

    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));

    if (distance <= radius1 + radius2) {
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
	if (checkCollisions(hook, cube, 2, 6) == true) {
		// Atualiza a posição do cubo para a posição do gancho
        cube.children[0].material.color.setHex(0x0b0fd3);
	}
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
        hookOpenAngle(1, delta);
        document.getElementById("R").style.backgroundColor = "grey";
    } else {
        document.getElementById("R").style.backgroundColor = "";
    }
    if (keyF) {
        hookOpenAngle(-1, delta);
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
    document.getElementById(numKeys[activeKey - 1]).style.backgroundColor = "grey"

	handleCollisions();

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


    update();

    render();

    requestAnimationFrame(animate);
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
    upperCrane.rotation.y += direction * 0.1 * delta;
}

function moveTrolley(direction, delta) {
    if (trolleyAssembly.position.x >= (upperCrane.position.x + 1.25) && direction == 1) {
        return;
    } else if (trolleyAssembly.position.x <= (upperCrane.position.x - 42) && direction == -1) {
        return;
    } else {
        trolleyAssembly.position.x += direction * 3 * delta;
    }
}

function moveHook(direction, delta) {
    if (cableMesh.scale.y <= 0.1 && direction == 1) {
        return;
    } else if (cableMesh.scale.y >= 5.8 && direction == -1) {
        return;
    } else {
        hookAssembly.children[2].position.y += (direction * delta * 4);
        hookAssembly.children[3].position.y += (direction * delta * 4);
        hookAssembly.children[4].position.y += (direction * delta * 4);
        hookAssembly.children[5].position.y += (direction * delta * 4);
        hookMesh.position.y += (direction * delta * 4);
        cableMesh.position.y += (direction * delta * 2);
        cableMesh.scale.y += ((-1) * direction * delta) / 2.5;

    }
}

function hookOpenAngle(direction, delta) {
    var angle = direction ? (Math.PI / 4) * delta : 0;

    hookAssembly.children[2].rotation.x += angle;
    hookAssembly.children[3].rotation.x += angle;
    hookAssembly.children[4].rotation.x -= angle;
    hookAssembly.children[5].rotation.x -= angle;

    hookAssembly.children[2].rotation.z += angle;
    hookAssembly.children[3].rotation.z -= angle;
    hookAssembly.children[4].rotation.z += angle;
    hookAssembly.children[5].rotation.z -= angle;
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
			if(key7){
				key7 = false;
			}else{
				key7 = true;
			}
            break;
        case 81: // q for crane rotation
            keyQ = true;
            // upperCrane.rotation.y += 0.1;
            break;
        case 65: // a for negative crane rotation
            //upperCrane.rotation.y -= 0.1;
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
            dodecahedron.position.z -= 1; // Aumenta a posição em 1 unidade no eixo y
            break;
        case 40: // Seta para baixo
            dodecahedron.position.z += 1; // Diminui a posição em 1 unidade no eixo y
            break;
        case 39: // Seta para direita
            dodecahedron.position.x += 1; // Aumenta a posição em 1 unidade no eixo x
            break;
        case 37: // Seta para esquerda
            dodecahedron.position.x -= 1; // Diminui a posição em 1 unidade no eixo x
            break;
        case 79: // o
            dodecahedron.position.y += 1;
            break;
        case 80: // Seta para esquerda
            dodecahedron.position.y -= 1;
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
