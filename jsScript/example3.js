var scene, camera, renderer, cube, controls, sculpture;
init();
animate();
///Users/mathieuroy/Documents/wbst
//firebase deploy --only hosting

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight*0.9);
    document.body.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;
    controls.update();
    

    const geometry = new THREE.TorusGeometry( 2, 1, 16, 16 );

    const incr = 1;
    const spacefactor = 8;
    const sizeofbox = 10;
    const halfsize = sizeofbox / 2;
    const hexconvertval = 255 / sizeofbox; 
    const distanceforcam = sizeofbox * 1.1 * spacefactor;
    for (let i = 0; i < sizeofbox; i += incr) {
        for (let j = 0; j < sizeofbox; j += incr) {
            for (let k = 0; k < sizeofbox; k += incr) {
                var randomVal = Math.floor(Math.random() * 3) + 1;
                var myArr = new Array();
                myArr[k] = new Array();
                myArr[k][j] = new Array();
                myArr[k][j][i] = new Array();
                if (!(randomVal % 2 )) {
                    var rgb2hex = colourConvert(k, j, i, hexconvertval);
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