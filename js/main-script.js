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

var crane, lowerCrane, upperCrane;

var baseGeometry, baseMaterial, baseMesh;
var towerGeometry, towerMaterial, towerMesh;

var topTowerGeometry, topTowerMaterial, topTowerMesh;
var cabinGeometry, cabinMaterial, cabinMesh;
var boomGeometry, boomMaterial, boomMesh;
var counterBoomGeometry, counterBoomMaterial, counterBoomMesh;
var counterweightGeometry, counterweightMaterial, counterweightMesh;
var hoistRopeGeometry, hoistRopeMaterial, hoistRopeMesh;
var counterHoistRopeGeometry, counterHoistRopeMaterial, counterHoistRopeMesh;
var trolleyGeometry, trolleyMaterial, trolleyMesh;
var cableGeometry, cableMaterial, cableMesh;
var hookGeometry, hookMaterial, hookMesh;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));

    createCrane(0, 0, 0);

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
    topCamera.position.y = 10;

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
    baseMaterial = new THREE.MeshBasicMaterial({ color: 0x444745, wireframe: true });
    baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);

    baseMesh.position.set(x, y, z);

    obj.add(baseMesh);
}

function createCraneTower(obj, x, y, z){
    'use strict';

    towerGeometry = new THREE.BoxGeometry(5, 70, 5);
    towerMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true });
    towerMesh = new THREE.Mesh(towerGeometry, towerMaterial);

    towerMesh.position.set(x, y, z);

    obj.add(towerMesh);
}

function createLowerCrane(obj, x, y, z){
    'use strict';
    lowerCrane = new THREE.Object3D();

    createCraneBase(crane, x, y, z);
    createCraneTower(crane, x, y + 36, z);
    
    obj.add(lowerCrane);
}

// Upper crane definitions
function createTopTower(obj, x, y, z){
    'use strict';

    // Create a tetrahedron with a radius of 3 and detail of 0
    topTowerGeometry = new THREE.TetrahedronGeometry(5, 0);
    topTowerMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true });
    topTowerMesh = new THREE.Mesh(topTowerGeometry, topTowerMaterial);

    topTowerMesh.position.set(x, y, z);

    obj.add(topTowerMesh);
}

function createUpperCrane(obj, x, y, z){
    'use strict';
    upperCrane = new THREE.Object3D();

    createTopTower(upperCrane, x, y, z);

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

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    switch (e.keyCode) {
        case 49: //1
            activeCamera = frontCamera;
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
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