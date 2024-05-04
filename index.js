import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import getStarfield from "./getStarfield";

const h = window.innerHeight;
const w = window.innerWidth;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
const loader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);


// sun
const sunGroup = new THREE.Group();
scene.add(sunGroup);

// earth
const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
earthGroup.position.x += 15;
scene.add(earthGroup);

// jupiter
const jupiterGroup = new THREE.Group();
jupiterGroup.rotation.z = (-23.4 * Math.PI) / 180;
jupiterGroup.position.x += 22;
jupiterGroup.position.y += 3;
scene.add(jupiterGroup);

// geometries
const sunGeometry = new THREE.IcosahedronGeometry(4, 12);
const earthGeometry = new THREE.IcosahedronGeometry(1, 12);
const jupiterGeometry = new THREE.IcosahedronGeometry(2, 12);

// sun mesh
const sunMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/sunmap.jpg"),
});
const sunMap = new THREE.Mesh(sunGeometry, sunMat);
sunGroup.add(sunMap);

const sunmaterial = new THREE.MeshPhongMaterial({
  emissive: 0xffff00, 
  emissiveIntensity: 10,
  shininess: 100, 
  opacity: 0.6,
  transparent: true,
});
const sunMesh = new THREE.Mesh(sunGeometry, sunmaterial);
sunMesh.scale.setScalar(1.05);
sunGroup.add(sunMesh);

const sunLight = new THREE.PointLight(0xffffff, 40);
sunLight.position.copy(sunGroup.position);
scene.add(sunLight);

// earth mesh
const earthMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
  opacity: 0.4,
});
const lightsMesh = new THREE.Mesh(earthGeometry, lightsMat);
lightsMesh.scale.setScalar(1.002);
earthGroup.add(lightsMesh);

// const cloudsMat = new THREE.MeshBasicMaterial({
//   map: loader.load("./textures/earthcloudmap.jpg"),
//   blending: THREE.AdditiveBlending,
//   opacity: 0.3,
// });
// const cloudsMesh = new THREE.Mesh(earthGeometry, cloudsMat);
// cloudsMesh.scale.setScalar(1.005);
// earthGroup.add(cloudsMesh);

// jupiter mesh
const jupiterMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/jupiter2_4k.jpg"),
});
const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiterGroup.add(jupiterMesh);

// stars
const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const earthPosition = earthGroup.position.clone();

camera.position.copy(earthPosition);
camera.position.z += 20;
camera.lookAt(earthPosition);



// important

sunGroup.add(earthGroup);
sunGroup.add(jupiterGroup);

function animate() {
  // earth
  earthMesh.rotation.y += 0.01;
  lightsMesh.rotation.y += 0.01;
  //cloudsMesh.rotation.y += 0.003;
  // jupiter
  jupiterMesh.y += 0.005;

  stars.rotation.y -= 0.0002;

  sunGroup.rotation.y += 0.002;
  //sunGroup.rotation.y -= 0.002;
  camera.lookAt(earthPosition);

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);



function rotateAroundAxis(object, axis, angle) {
    const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    object.applyQuaternion(quaternion);
}