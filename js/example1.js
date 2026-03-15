var scene, camera, renderer, cube, controls, sculpture;
init();
animate();

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);

    pointlight = new THREE.PointLight(0xffffff,1);
    pointlight.position.set(200,200,200);
    scene.add(pointlight);

    pointlight2 = new THREE.PointLight(0xffffff,1);
    pointlight2.position.set(-200,-200,200);
    scene.add(pointlight2);


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;
    controls.update();

    //const material = new THREE.MeshNormalMaterial( { flatShading: true } );
    //const material = new THREE.MeshBasicMaterial( {color: 0x000000,});
    const geometry = new THREE.SphereBufferGeometry( 1, 16, 16 );
    const geometry2 = new THREE.CylinderGeometry( 0.25, 0.25, 7, 12 );
    const exporter = new THREE.GLTFExporter();
    const material = new THREE.MeshLambertMaterial({color: '#B38B59', emissive: '#113E21'})

    /*const diffuseColor = new THREE.Color().setHSL( 0.7, 0.5, 0.3 * 0.5 + 0.1 );

    const material = new THREE.MeshBasicMaterial( {
        map: null,
        color: diffuseColor,
        reflectivity: 0.5,
        envMap: null
    } );*/

    const incr = 0.5;
    const spacefactor = 3;
    const sizeofbox = 21;
    const radius = 3;
    const halfsize = sizeofbox / 2;
    const distanceforcam = radius * 3 * spacefactor;
    
    for (let k = 0; k < sizeofbox; k += incr) {
        for (let t = -1*halfsize; t < halfsize; t +=incr ) {
            var a = radius*Math.cos(t);
            var b = radius*Math.sin(t);
            var c = 2*t;
            var myArr = new Array();
            var myArr2 = new Array();
            var myArr3 = new Array();
            myArr[k] = new Array();
            myArr2[k] = new Array();
            myArr3[k] = new Array();
            myArr[k] = new THREE.Mesh( geometry, material );
            myArr2[k] = new THREE.Mesh( geometry, material );
            myArr3[k] = new THREE.Mesh( geometry2, material );
            scene.add( myArr[k]);
            scene.add( myArr2[k]);
            scene.add( myArr3[k]);
            myArr[k].position.set(a, b, c);
            myArr2[k].position.set(-a, -b, c);
            myArr3[k].position.set(0, 0, c);
            myArr3[k].rotation.z = -1*Math.atan(a/b);
        
        }
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