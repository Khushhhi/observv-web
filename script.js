// Three.js plane flyover animation

// Get container
const container = document.getElementById('plane-container');

// Create scene, camera, renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 2, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Enhanced lighting for better visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Create a realistic RC plane
function createRCPlane() {
  const group = new THREE.Group();
  
  // Fuselage (main body) - cylinder with tapered nose
  const fuselageGeometry = new THREE.CylinderGeometry(0.15, 0.25, 4, 8);
  const fuselageMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
  fuselage.rotation.z = Math.PI / 2; // Orient horizontally
  fuselage.position.set(0, 0, 0);
  group.add(fuselage);
  
  // Nose cone
  const noseGeometry = new THREE.ConeGeometry(0.15, 0.8, 8);
  const noseMaterial = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.rotation.z = -Math.PI / 2;
  nose.position.set(2.4, 0, 0);
  group.add(nose);
  
  // Main wings
  const wingGeometry = new THREE.BoxGeometry(0.15, 3.5, 1.2);
  const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x4ecdc4 });
  const wing = new THREE.Mesh(wingGeometry, wingMaterial);
  wing.position.set(-0.5, 0, 0);
  group.add(wing);
  
  // Wing tips (rounded)
  const wingTipGeometry = new THREE.SphereGeometry(0.15, 8, 6);
  const leftWingTip = new THREE.Mesh(wingTipGeometry, wingMaterial);
  leftWingTip.position.set(-0.5, 1.75, 0);
  leftWingTip.scale.set(1, 0.3, 0.8);
  group.add(leftWingTip);
  
  const rightWingTip = new THREE.Mesh(wingTipGeometry, wingMaterial);
  rightWingTip.position.set(-0.5, -1.75, 0);
  rightWingTip.scale.set(1, 0.3, 0.8);
  group.add(rightWingTip);
  
  // Tail wing (horizontal stabilizer)
  const tailWingGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.4);
  const tailWing = new THREE.Mesh(tailWingGeometry, wingMaterial);
  tailWing.position.set(-1.8, 0, 0);
  group.add(tailWing);
  
  // Vertical stabilizer (rudder)
  const rudderGeometry = new THREE.BoxGeometry(0.1, 0.4, 1);
  const rudder = new THREE.Mesh(rudderGeometry, wingMaterial);
  rudder.position.set(-1.8, 0, 0.5);
  group.add(rudder);
  
  // Propeller
  const propGeometry = new THREE.BoxGeometry(0.05, 1.8, 0.1);
  const propMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const propeller = new THREE.Mesh(propGeometry, propMaterial);
  propeller.position.set(2.8, 0, 0);
  group.add(propeller);
  
  // Propeller hub
  const hubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8);
  const hubMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
  const hub = new THREE.Mesh(hubGeometry, hubMaterial);
  hub.rotation.z = Math.PI / 2;
  hub.position.set(2.9, 0, 0);
  group.add(hub);
  
  // Landing gear
  const gearGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6);
  const gearMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
  
  // Main landing gear
  const leftGear = new THREE.Mesh(gearGeometry, gearMaterial);
  leftGear.position.set(-0.3, 0.8, -0.5);
  group.add(leftGear);
  
  const rightGear = new THREE.Mesh(gearGeometry, gearMaterial);
  rightGear.position.set(-0.3, -0.8, -0.5);
  group.add(rightGear);
  
  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8);
  const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
  
  const leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  leftWheel.rotation.x = Math.PI / 2;
  leftWheel.position.set(-0.3, 0.8, -0.8);
  group.add(leftWheel);
  
  const rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  rightWheel.rotation.x = Math.PI / 2;
  rightWheel.position.set(-0.3, -0.8, -0.8);
  group.add(rightWheel);
  
  // Tail wheel
  const tailWheelGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8);
  const tailWheel = new THREE.Mesh(tailWheelGeometry, wheelMaterial);
  tailWheel.rotation.x = Math.PI / 2;
  tailWheel.position.set(-1.8, 0, -0.4);
  group.add(tailWheel);
  
  // Cockpit canopy
  const canopyGeometry = new THREE.SphereGeometry(0.2, 8, 6);
  const canopyMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x87ceeb, 
    transparent: true, 
    opacity: 0.7 
  });
  const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
  canopy.position.set(0.5, 0, 0.1);
  canopy.scale.set(1.5, 0.8, 0.6);
  group.add(canopy);
  
  // Store propeller reference for animation
  group.userData.propeller = propeller;
  
  return group;
}

const plane = createRCPlane();
scene.add(plane);

// Smooth flight animation variables
let startTime = null;
const flightDuration = 3000; // 3 seconds to cross screen
const startX = -20;
const endX = 20;
const flightHeight = 3;

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / flightDuration, 1);
  
  // Smooth easing function (ease-in-out)
  const easeProgress = progress < 0.5 
    ? 2 * progress * progress 
    : -1 + (4 - 2 * progress) * progress;
  
  // Position along X axis
  plane.position.x = startX + (endX - startX) * easeProgress;
  
  // Gentle Y movement with slight arc
  const arcHeight = Math.sin(progress * Math.PI) * 1.5;
  plane.position.y = flightHeight + arcHeight;
  
  // Banking/rotation for realistic flight
  const bankAngle = Math.sin(progress * Math.PI * 2) * 0.3;
  plane.rotation.z = bankAngle;
  plane.rotation.y = Math.sin(progress * Math.PI * 4) * 0.1;
  
  // Slight up/down pitch
  plane.rotation.x = Math.sin(progress * Math.PI) * 0.2;
  
  // Spin the propeller
  if (plane.userData.propeller) {
    plane.userData.propeller.rotation.x += 0.8; // Fast spinning
  }
  
  // Scale up the plane so it's actually visible
  plane.scale.set(1.2, 1.2, 1.2);
  
  renderer.render(scene, camera);
  
  // Restart animation when plane exits screen
  if (progress >= 1) {
    startTime = null;
  }
  
  requestAnimationFrame(animate);
}

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Kick-off animation
requestAnimationFrame(animate); 