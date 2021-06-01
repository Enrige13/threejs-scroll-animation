import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup - first three things: scene, camera, renderer
const scene = new THREE.Scene(); // container
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // arguments: field of view, aspect ratio (user browser), 2x view frustum 
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), //make the magic happen
});

renderer.setPixelRatio(window.devicePixelRatio); // pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight); // same size as browser
camera.position.setZ(30); // kamera in the center - z-axe +30
camera.position.setX(-3);

renderer.render(scene, camera); // renderer == draw

// Torus
// https://threejs.org/docs/index.html#api/en/geometries/BoxGeometry
const geometry = new THREE.TorusGeometry(10, 3, 16, 100); 
// https://threejs.org/docs/index.html#api/en/materials/LineBasicMaterial
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 }); // no light source
// Custom shaders with WebGL possible
const torus = new THREE.Mesh(geometry, material); // combine material + geometry into mesh

scene.add(torus);

// Lights
// https://threejs.org/docs/index.html#api/en/lights/AmbientLight
const pointLight = new THREE.PointLight(0xffffff); // light in all directions
pointLight.position.set(5, 5, 5); 

const ambientLight = new THREE.AmbientLight(0xffffff); // light up everything
scene.add(pointLight, ambientLight);

// Helpers - shows position of objects
// const lightHelper = new THREE.PointLightHelper(pointLight) // position of pointLight
// const gridHelper = new THREE.GridHelper(200, 50); // 2d grid scene
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement); // move around in the scene - need to be imported

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100)); // randFloatSpread - renders number from negativ to positive

  star.position.set(x, y, z); // set position of stars
  scene.add(star);
}
Array(200).fill().forEach(addStar); // fill array

// Background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Avatar - textur mapping
const jeffTexture = new THREE.TextureLoader().load('jeff.png');
const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3), 
  new THREE.MeshBasicMaterial({ map: jeffTexture }));

scene.add(jeff);

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture, // wrap around the sphere
    normalMap: normalTexture, // illusion of mounts
  })
);

scene.add(moon);
// position down - scrolling perspective
moon.position.z = 30;
moon.position.setX(-10);

jeff.position.z = -5;
jeff.position.x = 2;

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top; // get the viewpoint
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera; // event handler, when the user scrolls
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate); // browser perform a animation
  // rotation, position, loop
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();
  renderer.render(scene, camera); // calls render method to update
}

animate();
