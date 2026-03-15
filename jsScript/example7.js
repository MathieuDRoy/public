//import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.120.1/jsm/controls/OrbitControls';
//import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';
 
var scene, camera, renderer, cube, controls, sculpture;
init();
animate();

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;
    controls.update();
    
    var distanceforcam = 2*10;

    const geometry = new THREE.SphereGeometry(1, 20, 20);

    const material = new THREE.MeshBasicMaterial( { color: "#7A7AAF"} );
    var myArr = new Array();
    myArr[0] = new Array();
    myArr[0] = new THREE.Mesh( geometry, material );
    scene.add( myArr[0]);
    myArr[0].position.set(5, 5, 5);

    myArr[1] = new Array();
    myArr[1] = new THREE.Mesh( geometry, material );
    scene.add( myArr[1]);
    myArr[1].position.set(5, 5, -5);

    myArr[2] = new Array();
    myArr[2] = new THREE.Mesh( geometry, material );
    scene.add( myArr[2]);
    myArr[2].position.set(5, -5, 5);

    myArr[3] = new Array();
    myArr[3] = new THREE.Mesh( geometry, material );
    scene.add( myArr[3]);
    myArr[3].position.set(5, -5, -5);

    myArr[4] = new Array();
    myArr[4] = new THREE.Mesh( geometry, material );
    scene.add( myArr[4]);
    myArr[4].position.set(-5, 5, 5);

    myArr[5] = new Array();
    myArr[5] = new THREE.Mesh( geometry, material );
    scene.add( myArr[5]);
    myArr[5].position.set(-5, 5, -5);

    myArr[6] = new Array();
    myArr[6] = new THREE.Mesh( geometry, material );
    scene.add( myArr[6]);
    myArr[6].position.set(-5, -5, 5);

    myArr[7] = new Array();
    myArr[7] = new THREE.Mesh( geometry, material );
    scene.add( myArr[7]);
    myArr[7].position.set(-5, -5, -5);

    myArr[8] = new Array();
    myArr[8] = new THREE.Mesh( geometry, material );
    scene.add( myArr[8]);
    myArr[8].position.set(0, 0, 0);

    camera.position.z = distanceforcam;
    
    controls.enablePan = false;
    controls.enableDamping = true;   

}

function animate() {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function colourConvert(r, g, b, hexconvertval) {
    r = Math.floor(r*hexconvertval);
    g = Math.floor(g*hexconvertval);
    b = Math.floor(b*hexconvertval);
    return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

window.addEventListener('resize', onWindowResize);