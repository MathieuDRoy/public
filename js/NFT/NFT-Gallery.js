import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const ALCHEMY_KEY = "t3imt2oGKV9JZ8Ez7sS8s";
const WALLETCONNECT_PROJECT_ID = "ae733e2ad1374b740d09783c00d9b1c4";
const DEFAULT_WALLET = ""; //"0x6eeEB2b5e7744BB10b5B02334D5f7E187af391Bb";
let currentWallet = DEFAULT_WALLET;
let arrDataFromChain = [];

const walletInput = document.getElementById("wallet-input");
const useAddressBtn = document.getElementById("use-address-btn");
const connectBtn = document.getElementById("connect-btn");
const disconnectBtn = document.getElementById("disconnect-btn");
const ethNwTgl = document.getElementById("eth-toggle");
const plyNwTgl = document.getElementById("ply-toggle");
const absNwTgl = document.getElementById("abs-toggle");

const statusDiv = document.getElementById("status");
const CHAIN_MAP = {
  eth: "eth-mainnet",
  polygon: "polygon-mainnet",
  abstract: "abstract-mainnet"
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight*0.85);
document.body.appendChild(renderer.domElement);

// Reticle
const reticleGeometry = new THREE.RingGeometry(0.005, 0.01, 3);
const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x00311F, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
camera.add(reticle);
reticle.position.set(0, 0, -0.5);
reticle.rotation.z = -Math.PI/2;
scene.add(camera);


// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7).normalize();
scene.add(dirLight);


// Gallery room
const textureLoader = new THREE.TextureLoader();
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
const textureWood = textureLoader.load('../images/Wood-Texture.jpg');
const materialWood = new THREE.MeshPhongMaterial({map: textureWood});
textureWood.colorSpace = THREE.SRGBColorSpace;
textureWood.anisotropy = maxAnisotropy;
textureWood.wrapS = textureWood.wrapT = THREE.RepeatWrapping;

const floor = new THREE.Mesh(new THREE.PlaneGeometry(50,50), materialWood);
floor.rotation.x = -Math.PI/2; scene.add(floor);
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(50,50), new THREE.MeshPhongMaterial({color:0xFFFFFF}));
ceiling.rotation.x = Math.PI/2; ceiling.position.set(0,20,0); scene.add(ceiling);
const wallMat = new THREE.MeshPhongMaterial({color:0xFFF7E6, side:THREE.DoubleSide});
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(50,20), wallMat);
backWall.position.set(0,10,-25); scene.add(backWall);
const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(50,20), wallMat);
leftWall.rotation.y = Math.PI/2; leftWall.position.set(-25,10,0); scene.add(leftWall);
const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(50,20), wallMat);
rightWall.rotation.y = -Math.PI/2; rightWall.position.set(25,10,0); scene.add(rightWall);
const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(50,20), wallMat);
frontWall.rotation.y = Math.PI; frontWall.position.set(0,10,25); scene.add(frontWall);

// Controls
const controls = new PointerLockControls(camera, document.body);
camera.position.set(0, 10, 5);

// Hover
const raycaster = new THREE.Raycaster();
const infoBox = document.getElementById("info");
let nftMeshes = [];

const keys = {};
document.addEventListener("keydown", e => keys[e.code]=true);
document.addEventListener("keyup", e => keys[e.code]=false);
var mouseDown = 0;
document.body.onmousedown = function() {
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}
function move(delta) {
  const speed = 15 * delta;
  if(keys["KeyW"]) controls.moveForward(speed);
  if(keys["KeyS"]) controls.moveForward(-speed);
  if(keys["KeyA"]) controls.moveRight(-speed);
  if(keys["KeyD"]) controls.moveRight(speed);
}

// --- Web3Modal v1 setup ---
const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider.default,
    options: {
      infuraId: null,
      rpc: {
        1: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
      },
      projectId: WALLETCONNECT_PROJECT_ID
    }
  }
};

const web3Modal = new window.Web3Modal.default({
  cacheProvider: false,
  providerOptions
});

let provider;
let web3;

async function connectWallet() {
  try {
    provider = await web3Modal.connect();
    web3 = new window.Web3(provider);
    const accounts = await web3.eth.getAccounts();
    currentWallet = accounts[0];
    statusDiv.textContent = `Connected: ${shorten(currentWallet)}`;
    connectBtn.style.display = "none";
    disconnectBtn.style.display = "inline-block";
    walletInput.value = currentWallet;
    fetchNFTs(currentWallet);
    document.body.addEventListener('click', () => controls.lock());
  } catch (err) {
    console.error("Web3Modal connect error:", err);
  }
}

async function disconnectWallet() {
  if (provider && provider.disconnect) {
    await provider.disconnect();
  }
  provider = null;
  web3 = null;
  connectBtn.style.display = "inline-block";
  disconnectBtn.style.display = "none";
  statusDiv.textContent = "Not connected";
  currentWallet = "";
}

function shorten(addr){
  return addr ? addr.slice(0,6)+"…"+addr.slice(-4) : "";
}

async function getNFTsByChain(chain, wallet) {
  const options = {method: 'GET', headers: {accept: 'application/json'}};
  try{
    const response = await fetch(`https://${chain}.g.alchemy.com/nft/v3/${ALCHEMY_KEY}/getNFTsForOwner?owner=${wallet}&withMetadata=true&pageSize=48`, options);
    const data = await response.json();
    arrDataFromChain = data["ownedNfts"] || [];
    return arrDataFromChain;

  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchNFTs(wallet) {

  nftMeshes.forEach(m => scene.remove(m));
  nftMeshes = [];
  let nfts = [];

  if(ethNwTgl.checked)
    nfts = nfts.concat(await getNFTsByChain(CHAIN_MAP.eth, wallet));
  if(plyNwTgl.checked)
    nfts = nfts.concat(await getNFTsByChain(CHAIN_MAP.polygon, wallet));
  if(absNwTgl.checked)
    nfts = nfts.concat(await getNFTsByChain(CHAIN_MAP.abstract, wallet));

  placeNFTs(nfts.slice(0, 15)); // limit for performance
}

function isVideo(url) {
  return /\.(mp4|webm|ogg|live)(\?|$)/i.test(url);
}

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(url);
}

function placeNFTs(nfts) {  
  let validNFTs = [];
  for (let i = 0; i<nfts.length; i++) {
    if(nfts[i].contract.isSpam == true || nfts[i].contract.totalSupply == null || nfts[i].contract.openSeaMetadata.safelistRequestStatus != "verified") {
      continue;
    };
    validNFTs.push(nfts[i]);
  }

  const texLoader = new THREE.TextureLoader();
  let px = xCalculatedPosition(0), py = yCalculatedPosition(0,validNFTs.length), pz = zCalculatedPosition(0);
  let addedNFTs = 0;
  validNFTs.forEach(nft => {
    let media;
    media =
      nft.animation?.cachedUrl ||
      nft.image?.cachedUrl ||
      nft.image?.thumbnailUrl ||
      nft.image?.pngUrl ||
      nft.raw?.metadata?.image ||
      nft.raw?.metadata?.image_url;

    if (isVideo(media)) {
      const video = document.createElement("video");
      video.src = media;
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;

      video.play().catch(err => console.error("Video play failed:", err));

      const texture = new THREE.VideoTexture(video);
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 6),
        new THREE.MeshBasicMaterial({ map: texture })
      );
      plane.position.set(px, py, pz);
      if (addedNFTs >= 12 && addedNFTs < 24) {
        plane.rotation.y = -Math.PI/2;
      } else if (addedNFTs >= 24 && addedNFTs < 36) {
        plane.rotation.y = Math.PI;
      } else if (addedNFTs >= 36 && addedNFTs < 48) {
        plane.rotation.y = Math.PI/2;
      }
      scene.add(plane);
      plane.userData = {
        title: nft.raw.metadata?.name,
        desc: nft.raw.metadata?.description || "",
        traits: nft.raw.metadata?.attributes || []
      };

      nftMeshes.push(plane);
    } else if (isImage(media)) {
      texLoader.load(
        media,
        tex => {
          const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 6),
            new THREE.MeshBasicMaterial({ map: tex })
          );
          plane.position.set(px, py, pz);
          if (addedNFTs >= 12 && addedNFTs < 24) {
            plane.rotation.y = -Math.PI/2;
          } else if (addedNFTs >= 24 && addedNFTs < 36) {
            plane.rotation.y = Math.PI;
          } else if (addedNFTs >= 36 && addedNFTs < 48) {
            plane.rotation.y = Math.PI/2;
          }
          scene.add(plane);
          plane.userData = {
            title: nft.raw.metadata?.name,
            desc: nft.raw.metadata?.description || "",
            traits: nft.raw.metadata?.attributes || []
          };
          nftMeshes.push(plane);
        },
        undefined,
        err => console.error("Texture load failed:", media, err)
      );
    } else if (media == nft.animation?.cachedUrl) {
      const video = document.createElement("video");
      video.src = media;
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;

      video.play().catch(err => console.error("Other media failed:", err));

      const texture = new THREE.VideoTexture(video);
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 6),
        new THREE.MeshBasicMaterial({ map: texture })
      );
      plane.position.set(px, py, pz);
      if (addedNFTs >= 12 && addedNFTs < 24) {
        plane.rotation.y = -Math.PI/2;
      } else if (addedNFTs >= 24 && addedNFTs < 36) {
        plane.rotation.y = Math.PI;
      } else if (addedNFTs >= 36 && addedNFTs < 48) {
        plane.rotation.y = Math.PI/2;
      }      
      scene.add(plane);
      plane.userData = {
        title: nft.raw.metadata?.name,
        desc: nft.raw.metadata?.description || "",
        traits: nft.raw.metadata?.attributes || []
      };
      nftMeshes.push(plane);
    } else {
      console.warn("Unsupported media:", media);
    }
    addedNFTs++;
    px = xCalculatedPosition(addedNFTs);
    py = yCalculatedPosition(addedNFTs, validNFTs.length);
    pz = zCalculatedPosition(addedNFTs);
  });
  animate();
}

function xCalculatedPosition(addedNFTs) {
  if (addedNFTs < 12 ) {
    if (addedNFTs < 6 ) {
      return -20 + ((addedNFTs) *8);
    } else
      return -20 + ((addedNFTs-6) *8);
  } else if (addedNFTs >= 12 && addedNFTs < 24) {
    return 24.99;
  } else if (addedNFTs >= 24 && addedNFTs < 36) {
    if (addedNFTs >= 24 && addedNFTs < 30 ) {
      return 20 - ((addedNFTs-24) *8);
    } else
      return 20 - ((addedNFTs-30) *8);
  } else if (addedNFTs >= 36 && addedNFTs <= 48) {
    return -24.99;
  } 

}
function yCalculatedPosition(addedNFTs, totalNFTs) {
  if (totalNFTs <= 6 ) {
    return 10
  } else {
    if (addedNFTs < 6 ) {
      return 7;
    } else if (addedNFTs >= 6 && addedNFTs < 12) {
      return 15;
    } else if (addedNFTs >= 12 && addedNFTs < 18) {
      return 7;
    } else if (addedNFTs >= 18 && addedNFTs < 24) {
      return 15;
    } else if (addedNFTs >= 24 && addedNFTs < 30) {
      return 7;
    } else if (addedNFTs >= 30 && addedNFTs < 36) {
      return 15;
    } else if (addedNFTs >= 36 && addedNFTs < 42) {
      return 7;
    } else if (addedNFTs >= 42 && addedNFTs <= 48) {
      return 15;
    }
  }
}
function zCalculatedPosition(addedNFTs) {
  if (addedNFTs < 12 ) {
    return -24.99;
  } else if (addedNFTs >= 12 && addedNFTs < 24) {
    if (addedNFTs >= 12 && addedNFTs < 18 ) {
      return -27 + ((addedNFTs-11) * 8);
    } else {
      return -27 + ((addedNFTs-17) * 8);
    }
  } else if (addedNFTs >= 24 && addedNFTs < 36) {
    return 24.99;
  } else if (addedNFTs >= 36 && addedNFTs <= 48) {
    if (addedNFTs >= 36 && addedNFTs < 42 ) {
      return 27 - ((addedNFTs-35) * 8);
    } else {
      return 27 - ((addedNFTs-41) * 8);
    }
  }
}

// Animate
let prev = performance.now();
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now(); const delta = (now-prev)/1000; prev = now;
  move(delta);

  raycaster.setFromCamera({x:0,y:0}, camera);
  const intersects = raycaster.intersectObjects(nftMeshes);
  if(intersects.length>0 && mouseDown>0) {
    const nft = intersects[0].object.userData;
    infoBox.style.display = "block";
    infoBox.innerHTML = `<b>${nft.title}</b><br>${nft.desc}<br>
      ${nft.traits.map(t=>`${t.trait_type}: ${t.value}`).join(", ")}`;
  } else {
    infoBox.style.display = "none";
  }

  renderer.render(scene,camera);
}

// --- Event listeners ---
connectBtn.addEventListener("click", connectWallet);
disconnectBtn.addEventListener("click", disconnectWallet);
ethNwTgl.addEventListener("change", () => fetchNFTs(currentWallet));
plyNwTgl.addEventListener("change", () => fetchNFTs(currentWallet));
absNwTgl.addEventListener("change", () => fetchNFTs(currentWallet));
useAddressBtn.addEventListener("click", () => {
  const val = walletInput.value.trim();
  if(/^0x[a-fA-F0-9]{40}$/.test(val)){
    currentWallet = val;
    fetchNFTs(currentWallet);
  } else {
    alert("Invalid address");
  }
  document.body.addEventListener('click', () => controls.lock());
});
walletInput.addEventListener("keypress", e => { if(e.key==="Enter") useAddressBtn.click(); });

animate();
