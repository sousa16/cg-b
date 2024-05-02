import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////


var camera, scene, renderer, aspectRatio;
var activeCamera, frontCamera, sideCamera, topCamera, orthographicCamera, perspectiveCamera, mobileCamera;

var materials;
var crane, lowerCrane, upperCrane;

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

var materials = {
    "dark grey": new THREE.MeshBasicMaterial({ color: 0x444745, wireframe: true }),
    "white": new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
    "yellow": new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true }),
    "transparent": new THREE.MeshBasicMaterial({ color: 0x87CEFA, opacity: 0.5, transparent: true }),
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));

    createCrane(0, 0, 0);

	createContainer(0, 0, 70);
	createCubeLoad(30, 15, 50);
	createDodecahedronLoad(25, 10, 30);
	createIcosahedronLoad(50, 10, 10);
	createTorusLoad(60, 10, 65);
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
    frontCamera.position.z = 10;    

    // Side camera
    sideCamera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
    sideCamera.position.x = 10;

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
    //mobileCamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    //mobileCamera.position.set(0, 10, 0); // Position it along the length of the boom

    activeCamera = frontCamera;

    // Make sure they're pointing towards the scene
    frontCamera.lookAt(scene.position);
    sideCamera.lookAt(scene.position);
    topCamera.lookAt(scene.position);
    orthographicCamera.lookAt(scene.position);
    perspectiveCamera.lookAt(scene.position);
    //mobileCamera.lookAt(new THREE.Vector3(0, 0, 0)); // Orient it to look directly over the xOz plane
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

// Lower crane definitions
function createCraneBase(obj, x, y, z){
    'use strict';

    baseGeometry = new THREE.BoxGeometry(10, 2, 10);
    baseMesh = new THREE.Mesh(baseGeometry, materials["dark grey"]);

    baseMesh.position.set(x, y, z);

    obj.add(baseMesh);
}

function createCraneTower(obj, x, y, z){
    'use strict';

    towerGeometry = new THREE.BoxGeometry(5, 60, 5);
    towerMesh = new THREE.Mesh(towerGeometry, materials["yellow"]);

    towerMesh.position.set(x, y, z);

    obj.add(towerMesh);
}

function createLowerCrane(obj, x, y, z){
    'use strict';
    lowerCrane = new THREE.Object3D();

    createCraneBase(crane, x, y, z);
    createCraneTower(crane, x, y + 31, z);
    
    obj.add(lowerCrane);
}

// Upper crane definitions
function createTopTower(obj, x, y, z){
    'use strict';

    topTowerGeometry = new THREE.BoxGeometry(5, 3, 5);
    topTowerMesh = new THREE.Mesh(topTowerGeometry, materials["yellow"]);

    topTowerMesh.position.set(x, y - 10, z);

    obj.add(topTowerMesh);
}
function createPeak(obj, x, y, z){

    'use strict';

    // Create a box for the base of the pyramid
    basePeakGeometry = new THREE.BoxGeometry(5, 0.1, 5);
    basePeakMesh = new THREE.Mesh(basePeakGeometry, materials["yellow"]);

    basePeakMesh.position.set(x, y - 8.5, z);

    obj.add(basePeakMesh);

    // Create a cylinder for the sides of the pyramid
    sidesGeometry = new THREE.CylinderGeometry(0, 5 / Math.sqrt(2), 10, 4);
    sidesMesh = new THREE.Mesh(sidesGeometry, materials["yellow"]);

    sidesMesh.position.set(x, y - 3.5, z);

    // Rotate the sidesMesh by 45 degrees around the Y axis
    sidesMesh.rotation.y = Math.PI / 4;

    obj.add(sidesMesh);
}

function createCabin(obj, x, y, z){
    'use strict';

    cabinGeometry = new THREE.BoxGeometry(5, 3, 3);
    cabinMesh = new THREE.Mesh(cabinGeometry, materials["transparent"]);

    // Position the cabin as a part of the upperCrane
    cabinMesh.position.set(x, y - 10, z + 4);

    obj.add(cabinMesh);
}

function createBoom(obj, x, y, z){
    'use strict';

    boomGeometry = new THREE.BoxGeometry(5, 50, 3);
    boomMesh = new THREE.Mesh(boomGeometry, materials["yellow"]);

    // Position the boom above the cabin and rotate it 
    boomMesh.position.set(x + 27.5, y - 10, z);
    boomMesh.rotation.x = (Math.PI / 2);
    boomMesh.rotation.z = 3 * (Math.PI / 2);

    obj.add(boomMesh);
}

function createCounterBoom(obj, x, y, z){
    'use strict';

    counterBoomGeometry = new THREE.BoxGeometry(5, 20, 3);
    counterBoomMesh = new THREE.Mesh(counterBoomGeometry, materials["yellow"]);

    // Position the counterBoom above the cabin and rotate it 
    counterBoomMesh.position.set(x - 12.5, y - 10, z);
    counterBoomMesh.rotation.x = (Math.PI / 2);
    counterBoomMesh.rotation.z = (Math.PI / 2);

    obj.add(counterBoomMesh);

}

function createUpperCrane(obj, x, y, z){
    'use strict';
    upperCrane = new THREE.Object3D();

    createTopTower(upperCrane, x, y, z);
    createPeak(upperCrane, x, y, z);
    createCabin(upperCrane, x, y, z);
    createBoom(upperCrane, x, y, z);
    createCounterBoom(upperCrane, x, y, z);
    
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
function addBase(obj, x, y, z){
	'use strict';

    var geometry = new THREE.BoxGeometry(30, 0, 45);
    var mesh = new THREE.Mesh(geometry, materials["dark grey"]);
    mesh.position.set(x, y , z);
    obj.add(mesh);
}
function addBigWall(obj, x, y, z){
	'use strict';

    var geometry = new THREE.BoxGeometry(4, 30, 45);
    var mesh = new THREE.Mesh(geometry, materials["dark grey"]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}
function addSmallWall(obj, x, y, z){
	'use strict';

    var geometry = new THREE.BoxGeometry(38, 30, 4);
    var mesh = new THREE.Mesh(geometry, materials["dark grey"]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createContainer(x, y, z) {
    'use strict';

	var container = new THREE.Object3D();

	addBase(container, 0,  0,  0);
	addBigWall(container, 17,  15,  0);
	addBigWall(container, -17,  15,  0);
	addSmallWall(container, 0,  15,  24.5);
	addSmallWall(container, 0,  15,  -24.5);

	scene.add(container);

    container.position.x = x;
    container.position.y = y;
    container.position.z = z;
}

/*========================= CREATE OBJECT LOADS===================================*/
function createCubeLoad(x, y, z){
	'use strict';

	var geometry = new THREE.BoxGeometry(15, 15, 15);
    var mesh = new THREE.Mesh(geometry, materials["dark grey"]);
    mesh.position.set(x, y / 2, z);
    scene.add(mesh);
}
function createDodecahedronLoad(x, y, z) {
    'use strict';

    var geometry = new THREE.DodecahedronGeometry(5);
    var mesh = new THREE.Mesh(geometry, materials["dark grey"]);
    mesh.position.set(x, y / 2, z);
    scene.add(mesh);
}
function createIcosahedronLoad(x, y, z) {
    'use strict';

    var geometry = new THREE.IcosahedronGeometry(12);
    var mesh = new THREE.Mesh(geometry, materials["dark grey"]);
    mesh.position.set(x, y , z);
    scene.add(mesh);
}
function createTorusLoad(x, y, z) {
    'use strict';

    var geometry = new THREE.TorusGeometry(8, 2);
    var mesh = new THREE.Mesh(geometry, materials["dark grey"]);
    mesh.position.set(x, y , z);
    scene.add(mesh);
}
function createTorusKnotLoad(x, y, z) {
    'use strict';

    var geometry = new THREE.TorusKnotGeometry(6, 1, 64, 8, 2, 3);
    var mesh = new THREE.Mesh(geometry, materials["dark grey"]);
    mesh.position.set(x, y , z);
    scene.add(mesh);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

    //upperCrane.rotation.y += 0.01;

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

    createScene();
    createCamera();

    render();

    //window.addEventListener("keyup", onKeyUp);
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
        /*case 54: //6
            activeCamera = mobileCamera;
            break; */
        case 55: //7
            for (var key in materials) {
                if (materials.hasOwnProperty(key)) {
                    materials[key].wireframe = !materials[key].wireframe;
                }
            }
            break;
        case 81: // q for crane rotation
            upperCrane.rotation.y += 0.1;
            break;
        case 65: // a for negative crane rotation
            upperCrane.rotation.y -= 0.1;
            break;

    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}

init();
animate();
