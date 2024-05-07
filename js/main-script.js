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
var crane, lowerCrane, upperCrane, trolleyAssembly, hookAssembly;
var cube, dodecahedron, isocahedron, torus, torusKnot;
var ball, cubeBall, dodeBall, isoBall, torusBall, torusKnotBall;

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
    "transparent": new THREE.MeshBasicMaterial({ color: 0x87CEFA, opacity: 0.5, transparent: true }),
}

/////////////////////
/* Keyboard Inputs */
/////////////////////
var keyA = false;
var keyQ = false;

var keyW = false;
var keyS = false;

var keyE = false;
var keyD = false;

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

    createCraneBase(crane, x, y, z);
    createCraneTower(crane, x, y + 31, z);

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

    hookGeometry = new THREE.BoxGeometry(1, 1, 1);
    hookMesh = new THREE.Mesh(hookGeometry, materials["dark grey"]);

    hookMesh.position.set(x + 50, y - 23.5, z);

    obj.add(hookMesh);
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

	createHookBall(upperCrane, x, y, z);
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

function addContainerBase(obj, x, y, z){
	'use strict';

    var geometry = new THREE.BoxGeometry(20, 0, 35);
    var mesh = new THREE.Mesh(geometry, materials["dark green 2"]);
    mesh.position.set(x, y , z);
    obj.add(mesh);
}
function addContainerBigWall(obj, x, y, z){
	'use strict';


    var geometry = new THREE.BoxGeometry(4, 20, 35);
    var mesh = new THREE.Mesh(geometry, materials["dark green"]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addContainerSmallWall(obj, x, y, z){
	'use strict';

    var geometry = new THREE.BoxGeometry(28, 20, 4);
    var mesh = new THREE.Mesh(geometry, materials["dark green 1"]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createContainer(x, y, z) {
    'use strict';

    var container = new THREE.Object3D();

	addContainerBase(container, 0,  0,  0);
	addContainerBigWall(container, 12,  10,  0);
	addContainerBigWall(container, -12,  10,  0);
	addContainerSmallWall(container, 0,  10,  19.5);
	addContainerSmallWall(container, 0,  10,  -19.5);

    scene.add(container);

    container.position.x = x;
    container.position.y = y;
    container.position.z = z;
}

/*========================= CREATE OBJECT LOADS===================================*/

function addCubeLoad(obj, x, y, z){
	'use strict';

	var geometry = new THREE.BoxGeometry(10, 10, 10);
    var mesh = new THREE.Mesh(geometry, materials["red"]);
    mesh.position.set(x, y / 2, z);
    obj.add(mesh);
}
function addDodecahedronLoad(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.DodecahedronGeometry(5);
    var mesh = new THREE.Mesh(geometry, materials["blue"]);
    mesh.position.set(x, y /2, z);
    obj.add(mesh);
}
function addIcosahedronLoad(obj, x, y, z) {
    'use strict';
    var geometry = new THREE.IcosahedronGeometry(7);
    var mesh = new THREE.Mesh(geometry, materials["orange"]);
    mesh.position.set(x, y , z);
    scene.add(mesh);
}
function addTorusLoad(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.TorusGeometry(4, 2);
    var mesh = new THREE.Mesh(geometry, materials["pink"]);
    mesh.position.set(x, y , z);
    scene.add(mesh);
}
function addTorusKnotLoad(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.TorusKnotGeometry(6, 1, 64, 8, 2, 3);
    var mesh = new THREE.Mesh(geometry, materials["purple"]);
    mesh.position.set(x, y , z);
    scene.add(mesh);
}

// Loads with colision spheres
function createCubeLoad(x, y, z){
	'use strict';

	cube = new THREE.Object3D();

	addCubeLoad(cube, x, y, z);
	createCubeBall(cube, x, y, z);

	scene.add(cube);
}
function createDodecahedronLoad(x, y, z) {
    'use strict';

	dodecahedron = new THREE.Object3D();

	addDodecahedronLoad(dodecahedron, x, y, z);
	createDodeBall(dodecahedron, x, y, z);

    scene.add(dodecahedron);
}
function createIcosahedronLoad(x, y, z) {
    'use strict';

	isocahedron = new THREE.Object3D();

	addIcosahedronLoad(isocahedron, x, y, z);
	createIsoBall(isocahedron, x, y + 6, z);

    scene.add(isocahedron);
}
function createTorusLoad(x, y, z) {
    'use strict';

	torus = new THREE.Object3D();

	addTorusLoad(torus, x, y, z);
	createTorusBall(torus, x, y + 6, z);

    scene.add(torus);
}
function createTorusKnotLoad(x, y, z) {
    'use strict';

	torusKnot = new THREE.Object3D();
	addTorusKnotLoad(torusKnot, x, y, z);
	createTorusKnotBall(torusKnot, x, y + 10, z);

    scene.add(torusKnot);
}
/*======================= CREATE COLISION DETECTION SPHERES =======================*/

function createHookBall(obj, x, y, z){
	'use strict';

	ball = new THREE.Object3D();

	ballGeometry = new THREE.SphereGeometry(2);
	ballMesh = new THREE.Mesh(ballGeometry, materials["pinkBall"]);

	ballMesh.material.opacity = 0.03;
    ballMesh.material.transparent = true;

	ball.add(ballMesh);
    ball.position.set(x + 50, y - 23.5, z);

    obj.add(ball);
}

function createCubeBall(obj, x, y, z){
	'use strict';

	cubeBall = new THREE.Object3D();

	ballGeometry = new THREE.SphereGeometry(6);
	ballMesh = new THREE.Mesh(ballGeometry, materials["pinkBall"]);

	ballMesh.material.opacity = 0.03;
    ballMesh.material.transparent = true;

	cubeBall.add(ballMesh);
    cubeBall.position.set(x, y / 2, z);

    obj.add(cubeBall);
}

function createDodeBall(obj, x, y, z){
	'use strict';

	dodeBall = new THREE.Object3D();

	ballGeometry = new THREE.SphereGeometry(5.5);
	ballMesh = new THREE.Mesh(ballGeometry, materials["pinkBall"]);

	ballMesh.material.opacity = 0.03;
    ballMesh.material.transparent = true;

	dodeBall.add(ballMesh);
    dodeBall.position.set(x, y / 2, z);

    obj.add(dodeBall);
}

function createIsoBall(obj, x, y, z){
	'use strict';

	isoBall = new THREE.Object3D();

	ballGeometry = new THREE.SphereGeometry(7);
	ballMesh = new THREE.Mesh(ballGeometry, materials["pinkBall"]);

	ballMesh.material.opacity = 0.03;
    ballMesh.material.transparent = true;

	isoBall.add(ballMesh);
    isoBall.position.set(x, y / 2, z);

    obj.add(isoBall);
}

function createTorusBall(obj, x, y, z){
	'use strict';

	torusBall = new THREE.Object3D();

	ballGeometry = new THREE.SphereGeometry(6);
	ballMesh = new THREE.Mesh(ballGeometry, materials["pinkBall"]);

	ballMesh.material.opacity = 0.03;
    ballMesh.material.transparent = true;

	torusBall.add(ballMesh);
    torusBall.position.set(x, y / 2, z);

    obj.add(torusBall);
}

function createTorusKnotBall(obj, x, y, z){
	'use strict';

	torusKnotBall = new THREE.Object3D();

	ballGeometry = new THREE.SphereGeometry(10);
	ballMesh = new THREE.Mesh(ballGeometry, materials["pinkBall"]);

	ballMesh.material.opacity = 0.03;
    ballMesh.material.transparent = true;

	torusKnotBall.add(ballMesh);
    torusKnotBall.position.set(x, y / 2, z);

    obj.add(torusKnotBall);
}


//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
    'use strict';
	if(checkSphereCollision(ball, cubeBall, 2, 6) == true){
		ball.children[0].material.color.setHex(0xff0000);

	}
	else if(checkSphereCollision(ball, dodeBall, 2, 5.5) == true){
		ball.children[0].material.color.setHex(0xff0000);
	}
	else if(checkSphereCollision(ball, isoBall, 2, 7) == true){
		ball.children[0].material.color.setHex(0xff0000);
	}
	else if(checkSphereCollision(ball, torusBall, 2, 6) == true){
		ball.children[0].material.color.setHex(0xff0000);
	}
	else if(checkSphereCollision(ball, torusKnotBall, 2, 10) == true){
		ball.children[0].material.color.setHex(0xff0000);
	}
	else{
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
    }
    if (keyQ) {
        rotateCraneY(1, delta);
    //upperCrane.rotation.y += 0.01;
	checkCollisions();
    }
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
    //clock.start();

    createScene();
    createCamera();

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
/* CRANE ROTATION FUNCTIONS */
//////////////////////////////

function rotateCraneY(direction, delta) {
    upperCrane.rotation.y += direction * 0.1 * delta;
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    switch (e.keyCode) {
        case 49: //1
            activeCamera = frontCamera;
            break;
        case 50: //2
            activeCamera = sideCamera;
            break;
        case 51: //3
            activeCamera = topCamera;
            break;
        case 52: //4
            activeCamera = orthographicCamera;
            break;
        case 53: //5
            activeCamera = perspectiveCamera;
            break;
        case 54: //6
            activeCamera = mobileCamera;
            break;
        case 55: //7
            for (var key in materials) {
                if (materials.hasOwnProperty(key)) {
                    materials[key].wireframe = !materials[key].wireframe;
                }
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
    }
}

init();
animate();
