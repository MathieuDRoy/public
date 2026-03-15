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
    

    const geometry = new THREE.SphereGeometry( .1, 4, 4 );

    const incr = 0.1;
    const spacefactor = 2;
    const sizeofbox = 8;
    const halfsize = sizeofbox / 2;
    const hexconvertval = 255 / sizeofbox; 
    const distanceforcam = sizeofbox * 1.5 * spacefactor;
    for (let i = 0; i < sizeofbox; i += incr) {
        for (let j = 0; j < sizeofbox; j += incr) {
            for (let k = 0; k < sizeofbox; k += incr) {
                var randomVal = Math.sin(k) + Math.cos(j);
                randomVal = Math.round(randomVal *10) / 10;
                var myArr = new Array();
                myArr[k] = new Array();
                myArr[k][j] = new Array();
                myArr[k][j][i] = new Array();
                if (randomVal == i ) {
                    var rgb2hex = colourConvert(k, j, i+6, hexconvertval);
                    const material = new THREE.MeshBasicMaterial( { color: Number(rgb2hex)} );
                    myArr[k][j][i] = new THREE.Mesh( geometry, material );
                    scene.add( myArr[k][j][i] );
                    myArr[k][j][i].position.set((k-halfsize)*spacefactor, (j-halfsize)*spacefactor, (i-halfsize)*spacefactor);
                }
            }
        }
    }

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