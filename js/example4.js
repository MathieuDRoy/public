//import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js';
//import { OrbitControls } from 'https://unpkg.com/three@0.120.1/jsm/controls/OrbitControls';
//import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';


var scene, camera, renderer, cube, controls, sculpture;
init();
animate();

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;
    controls.update();

    const radius = 10;
    const step   = 100;
    const dev    = 20;
    const length = step/10;
    

    //const geometry = new THREE.BoxGeometry( 3, 3, length );
    //const material = new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } );
    const material = new THREE.MeshNormalMaterial( { flatShading: true } );
    const exporter = new THREE.GLTFExporter();

    for (let i = -Math.PI; i < Math.PI; i += Math.PI/dev) {
        var blockDeapth =  i < 0 ? Math.abs((Math.PI-i)*2*Math.PI) : (Math.PI+i)*2*Math.PI;
        const geometry = new THREE.BoxGeometry( 3, 3,  blockDeapth);
        var x = radius*Math.cos(i);
        var y = radius*Math.sin(i);
        var distanceforcam = step;
        var myArr = new Array();
        myArr[i] = new Array();
        myArr[i] = new THREE.Mesh( geometry, material );
        scene.add( myArr[i] );
        myArr[i].position.set(x, y, (i*dev) );
        myArr[i].rotation.z = -Math.atan(x/y);
        console.log(blockDeapth);
    }

    camera.position.z = distanceforcam;
    
    controls.enablePan = false;
    controls.enableDamping = true;  
    
    const options = {
        trs: false,
        onlyVisible: false,
        truncateDrawRange: false,
        binary: false,
        maxTextureSize: 4096
    };
/*
    exporter.parse(
        scene,
        function ( result ) {
            if ( result instanceof ArrayBuffer ) {
                saveArrayBuffer( result, 'scene.glb' );
            } else {
                const output = JSON.stringify( result, null, 2 );
                console.log( output );
                saveString( output, 'scene.gltf' );
            }
        },
        // called when there is an error in the generation
        function ( error ) {    
            console.log( 'An error happened' );   
        },
        options
    );*/

}

const link = document.createElement( 'a' );
link.style.display = 'none';

function saveString( text, filename ) {
    save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}

function save( blob, filename ) {
    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
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

window.addEventListener('resize', onWindowResize);