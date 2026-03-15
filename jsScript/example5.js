
let container;

var scene, camera, renderer, cube, controls, sculpture;

init();
animate();

function init() {

    THREE.Cache.enabled = true;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;
    controls.update();


    // Ground

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry( 500, 500 ),
        new THREE.MeshBasicMaterial( {color: 0x567d46, side: THREE.DoubleSide} )

    );
    plane.rotation.x = - Math.PI / 2;
    //plane.position.x = 50;
    //plane.position.z = 50;
    scene.add( plane );

    plane.receiveShadow = true;
    var loader = new THREE.STLLoader();
    const material = new THREE.MeshNormalMaterial( { flatShading: true } );

    // Colored binary STL
    loader.load( 'Fiat_126.stl', function ( geometry ) {

        let meshMaterial = material;

        if ( geometry.hasColors ) {

            meshMaterial = new THREE.MeshPhongMaterial( { opacity: geometry.alpha, vertexColors: true } );

        }
        const mesh = new THREE.Mesh( geometry, meshMaterial );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.scale.set(0.1, 0.1, 0.1);
        mesh.rotation.x = -Math.PI/2;
        scene.add( mesh );

    } );

    camera.position.z = 150;
    camera.position.y = 150;
    
    controls.enablePan = false;
    controls.enableDamping = true;  
    
    const options = {
        trs: false,
        onlyVisible: false,
        truncateDrawRange: false,
        binary: false,
        maxTextureSize: 4096
    };

    const link = document.createElement( 'a' );
    link.style.display = 'none';
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