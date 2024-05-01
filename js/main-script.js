import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////


var camera, scene, renderer;
var geometry, material, mesh;
var activeCamera, frontCamera, sideCamera, topCamera, orthographicCamera, perspectiveCamera, mobileCamera;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
    scene.add(new THREE.AxesHelper(100));

	createContainer(0, 0, 70);
	createCubeLoad(30, 10, 50);
	createDodecahedronLoad(25, 10, 30);
	createIcosahedronLoad(50, 10, 10);
	createTorusLoad(60, 10, 65);

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';

    var aspectRatio = window.innerWidth / window.innerHeight;

    // Frontal camera
    frontCamera = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
    frontCamera.position.z = 200;

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

/*========================= CREATE OBJET CONTAINER===================================*/
function addBase(obj, x, y, z){
	'use strict';

    geometry = new THREE.BoxGeometry(30, 0, 45);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y , z);
    obj.add(mesh);
}
function addBigWall(obj, x, y, z){
	'use strict';

    geometry = new THREE.BoxGeometry(0, 30, 45);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}
function addSmallWall(obj, x, y, z){
	'use strict';

    geometry = new THREE.BoxGeometry(30, 30, 0);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createContainer(x, y, z) {
    'use strict';

	var container = new THREE.Object3D();

    //material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

	material = [
		new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Vermelho para a face frontal
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Verde para a face traseira
        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Azul para a face superior
        new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Amarelo para a face inferior
        new THREE.MeshBasicMaterial({ color: 0x00ffff })  // Ciano para a face esquerda
    ]


	addBase(container, 0,  0,  0);
	addBigWall(container, 15,  15,  0);
	addBigWall(container, -15,  15,  0);
	addSmallWall(container, 0,  15,  22.5);
	addSmallWall(container, 0,  15,  -22.5);

	scene.add(container);

    container.position.x = x;
    container.position.y = y;
    container.position.z = z;
}

/*========================= CREATE OBJET LOADS===================================*/
function createCubeLoad(x, y, z){
	'use strict';

	geometry = new THREE.BoxGeometry(10, 10, 10);
	material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y / 2, z);
    scene.add(mesh);
}
function createDodecahedronLoad(x, y, z) {
    'use strict';

    var geometry = new THREE.DodecahedronGeometry(5);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y / 2, z);
    scene.add(mesh);
}
function createIcosahedronLoad(x, y, z) {
    'use strict';

    var geometry = new THREE.IcosahedronGeometry(5);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y / 2, z);
    scene.add(mesh);
}
function createTorusLoad(x, y, z) {
    'use strict';

    var geometry = new THREE.TorusGeometry(5, 2);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y / 2, z);
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
