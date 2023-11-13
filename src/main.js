//βιβλιοθήκες
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { PointerLockControls } from 'three-stdlib';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene(); // Δημιουργία σκηνής

// ΔΔημιουργία κάμερας που μας λέει στην ουσία που κοιτάμε στη σκηνή
const camera = new THREE.PerspectiveCamera(
  75, // Πεδίο όρασης
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
scene.add(camera); // Προσθέτω την κάμερα στη σκηνή

//let deviceType = "POINTER";


//προσθήκη 3d αντικειμένου
let loadedModel1;
const glftLoader = new GLTFLoader();

// path αντικειμένου
glftLoader.load('./assets/sculpture/scene.gltf', (gltfScene) => {
  loadedModel1 = gltfScene;
  // console.log(loadedModel);

  gltfScene.scene.rotation.y = Math.PI / 8; //περιστροφή
  gltfScene.scene.position.set(0, 2.8, -18.5); //θέση στον χώρο
  gltfScene.scene.scale.set(0.009, 0.009, 0.009); //μέγεθος
  scene.add(gltfScene.scene);  //προσθήκη στη σκηνή
});


// path αντικειμένου
let loadedModel2;
glftLoader.load('./assets/tablebase/scene.gltf', (gltfScene) => {
  loadedModel2 = gltfScene;
  // console.log(loadedModel);

  //gltfScene.scene.rotation.y = Math.PI / 4; //περιστροφή
  gltfScene.scene.position.set(-3, -4, -20); //θέση στον χώρο
  gltfScene.scene.scale.set(0.2, 0.2, 0.2); //μέγεθος
  scene.add(gltfScene.scene);  //προσθήκη στη σκηνή
});


//προσθήκη 3d αντικειμένου
let loadedModel3;
// path αντικειμένου
glftLoader.load('./assets/vase/scene.gltf', (gltfScene) => {
  loadedModel3 = gltfScene;
  // console.log(loadedModel);

  gltfScene.scene.rotation.y = Math.PI / 8; //περιστροφή
  gltfScene.scene.position.set(1, 40, 44); //θέση στον χώρο
  gltfScene.scene.scale.set(3, 3, 3); //μέγεθος
  scene.add(gltfScene.scene);  //προσθήκη στη σκηνή
});

//προσθήκη 3d αντικειμένου
let loadedModel4;
// path αντικειμένου
glftLoader.load('./assets/chandelier/scene.gltf', (gltfScene) => {
  loadedModel4 = gltfScene;
  // console.log(loadedModel);

  gltfScene.scene.rotation.y = Math.PI / 8; //περιστροφή
  gltfScene.scene.position.set(0, 8, 1); //θέση στον χώρο
  gltfScene.scene.scale.set(3, 3, 3); //μέγεθος
  scene.add(gltfScene.scene);  //προσθήκη στη σκηνή
});


//προσθήκη 3d αντικειμένου
let loadedModel5;
// path αντικειμένου
glftLoader.load('./assets/door/scene.gltf', (gltfScene) => {
  loadedModel5 = gltfScene;
  // console.log(loadedModel);

  //gltfScene.scene.rotation.y = Math.PI / 1; //περιστροφή
  gltfScene.scene.position.set(0, -3, 19.5); //θέση στον χώρο
  gltfScene.scene.scale.set(0.06, 0.06, 0.06); //μέγεθος
  scene.add(gltfScene.scene);  //προσθήκη στη σκηνή
});


//προσθήκη 3d αντικειμένου
let loadedModel6;
// path αντικειμένου
glftLoader.load('./assets/vase/scene.gltf', (gltfScene) => {
  loadedModel6 = gltfScene;
  // console.log(loadedModel);

  gltfScene.scene.rotation.y = Math.PI / 8; //περιστροφή
  gltfScene.scene.position.set(37, 40, 44); //θέση στον χώρο
  gltfScene.scene.scale.set(3, 3, 3); //μέγεθος
  scene.add(gltfScene.scene);  //προσθήκη στη σκηνή
});


//προσθήκη 3d αντικειμένου
let loadedModel7;
// path αντικειμένου
glftLoader.load('./assets/plant/scene.gltf', (gltfScene) => {
  loadedModel7 = gltfScene;
  // console.log(loadedModel);

  gltfScene.scene.rotation.y = Math.PI / 2; //περιστροφή
  gltfScene.scene.position.set(-12, -3, 18); //θέση στον χώρο
  gltfScene.scene.scale.set(0.005, 0.005, 0.005); //μέγεθος
  scene.add(gltfScene.scene);  //προσθήκη στη σκηνή
});


//προσθήκη 3d αντικειμένου
let loadedModel8;
// path αντικειμένου
glftLoader.load('./assets/plant/scene.gltf', (gltfScene) => {
  loadedModel8 = gltfScene;
  // console.log(loadedModel);

  gltfScene.scene.rotation.y = Math.PI / 2; //περιστροφή
  gltfScene.scene.position.set(12, -3, 18); //θέση στον χώρο
  gltfScene.scene.scale.set(0.005, 0.005, 0.005); //μέγεθος
  scene.add(gltfScene.scene);  //προσθήκη στη σκηνή
});
camera.position.z = 5; // Πάμε την κάμερα λίγο πίσω

// Δημιουργία ενός renderer, ορίζουμε το μέγεθός και το χρώμα
const renderer = new THREE.WebGLRenderer({ antialias: true}); // antialias σημαίνει smooth άκρες
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // μέγεθος του renderer
renderer.setClearColor('#FFFFFF', 1); //background χρώμα

//Για το Vr
renderer.xr.enabled = true
renderer.xr.setReferenceSpaceType('local');
document.body.appendChild(renderer.domElement); // Προσθέτω το renderer στο html
document.body.appendChild(VRButton.createButton(renderer))

/*if('xr' in navigator) {
  navigator.xr.isSessionSupported( 'immersive-vr' )
      .then(function (supported) {
        if (supported) {
          deviceType = "XR";
        }
      }).catch(function() {
    //Do nothing for now...
  }).finally(function() {
    start();
  });
} else {
  start();
}*/

const controllerModelFactory = new XRControllerModelFactory();

// Ambient light είναι ένας απαλός φωτισμός όπου όλα τα αντικείμενα στη σκηνή φωτίζονται το ίδιο
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

// Directional light συμπεριφέρεται σαν τον ήλιο
const sunLight = new THREE.DirectionalLight(0xdddddd, 1.0);
sunLight.position.y = 15;
scene.add(sunLight);

const pointLight = new THREE.PointLight(0xffffff); // θέτουμε το χρώμα του φωτός μας, το λευκό
pointLight.position.set(0, 5.5, -14); // Θέτουμε την θέση στον χώρο μας όπου θα πέσει το φώς.
scene.add(pointLight); // Το προσθέτω στην σκηνή
pointLight.intensity = 1; // Θέτουμε πόσο έντονο θα είναι το φως.

// Controls
// Event Listener για όταν πατιούνται τα πλήκτρα(WSAD κτλ)
document.addEventListener('keydown', onKeyDown, false);

// Texture για το πάτωμα
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('img/damaged-parquet-texture.jpg'); //η εικόνα που χρησιμοποιούμαι για την όψη του πατώματος
floorTexture.wrapS = THREE.RepeatWrapping; // wrapS είναι η οριζόντια κατεύθυνση
floorTexture.wrapT = THREE.RepeatWrapping; // wrapT είναι η κάθετη κατεύθυνση
floorTexture.repeat.set(20, 20); // πόσες φορές γίνεται το texture


// δημιουργώ το επίπεδο του πατώματος.
const planeGeometry = new THREE.PlaneGeometry(42, 42); // BoxGeometry είναι το σχήμα ενός αντικειμένου
const planeMaterial = new THREE.MeshBasicMaterial({
  // MeshBasicMaterial είναι το πως μοιάζει ένα αντικείμενο (χρώμα ή texture)
  map: floorTexture, //texture του πατώματος
  side: THREE.DoubleSide,
});

const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial); // Δημιουργώ το πάτωμα

floorPlane.rotation.x = Math.PI / 2; // 90 μοίρες
floorPlane.position.y = -Math.PI; // -180 μοίρες

scene.add(floorPlane); // Προσθέτω πάτωμα στον χώρο

// Δημιουργία τοίχων
let wallGroup = new THREE.Group(); // Δημιουργία ενός group για να έχω μέσα τους τοίχους
scene.add(wallGroup); // Προσθέτουμε το group στη σκηνή και έτσι ότι προστεθεί σε αυτό μετά θα εμφανισθεί στη σκηνή


// Create wall material with realistic colors and texture
const wallTexture = textureLoader.load('img/grunge-gray-concrete-textured-background.jpg');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1, 1); // `repeat' είναι το πόσες φορές γίνεται το texture

const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });

// Τοίχος κεντρικός
const frontWall = new THREE.Mesh(
  new THREE.BoxGeometry(45, 20, 0.001), // geometry
  new THREE.MeshLambertMaterial({ map: wallTexture  })
);

frontWall.position.z = -20; // Σπρώχνουμε τον τοίχο κατά 20 στον άξονα ζ

// Τοίχος αριστερά
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(45, 20, 0.001), // geometry
  new THREE.MeshLambertMaterial({ map: wallTexture })
);

leftWall.rotation.y = Math.PI / 2; // 90 μοίρες
leftWall.position.x = -20; // 20 κατά τα αριστερά

// Τοίχος δεξιά
const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(45, 20, 0.001), // geometry
  new THREE.MeshLambertMaterial({ map: wallTexture })
);

rightWall.position.x = 20;
rightWall.rotation.y = Math.PI / 2; // 90 μοίρες

// Τοίχος πίσω
const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(45, 20, 0.001),
    new THREE.MeshLambertMaterial({ map: wallTexture })
);
backWall.position.z = 20;

wallGroup.add(frontWall, backWall, leftWall, rightWall); // Βάζουμε όλους τους τοίχους σε ένα group

// Γίνεται ένα δέσιμο μεταξύ των τοίχων
for (let i = 0; i < wallGroup.children.length; i++) {
  wallGroup.children[i].BBox = new THREE.Box3();
  wallGroup.children[i].BBox.setFromObject(wallGroup.children[i]);
}

// Δημιουργία του ταβανιού με τις διαστάσεις του
const ceilingTexture = textureLoader.load('img/grunge-gray-concrete-textured-background.jpg');
const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
const ceilingMaterial = new THREE.MeshLambertMaterial({ map: ceilingTexture,
});
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial); // Δημιουργούμε ταβάνι

ceilingPlane.rotation.x = Math.PI / 2; // Αυτό είναι 90 μοίρες
ceilingPlane.position.y = 10;

scene.add(ceilingPlane);

// Δημιουργία πίνακα
function createPainting(imageURL, width, height, position) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageURL); //εδω ορίζουμε πως θα είναι εικόνα
  const paintingMaterial = new THREE.MeshBasicMaterial({
    map: paintingTexture,
  });
  const paintingGeometry = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
  painting.position.set(position.x, position.y, position.z);
  return painting;
}

// Δημιουργία πινάκων και η τοποθέτηση τους στη σκηνή
const painting1 = createPainting(
  '/artworks/PicassoGuernica.jpg',
  10,
  5,
  new THREE.Vector3(-10, 5, -19.99)
);

const painting2 = createPainting(
  '/artworks/1.jpg',
  10,
  5,
  new THREE.Vector3(10, 5, -19.99)
);

const painting3 = createPainting(
    '/artworks/0.jpg',
    10,
    5,
    new THREE.Vector3(-19.99, 5, -10)
);
painting3.rotation.y = Math.PI / 2; // Γυρνάμε τον πίνακα 90 μοίρες ώστε να είναι στον αριστερό τοίχο.

// Painting on the right wall
const painting4 = createPainting(
    '/artworks/3.jpg',
    10,
    5,
    new THREE.Vector3(19.99, 5, -10)
);
painting4.rotation.y = -Math.PI / 2; // Rotate the painting by -90 degrees (watch the negative value of Math.PI here `-Math.PI / 2`

// Painting on the right wall
const painting5 = createPainting(
    '/artworks/4.jpg',
    10,
    5,
    new THREE.Vector3(19.99, 5, 10)
);
painting5.rotation.y = -Math.PI / 2; // Rotate the painting by -90 degrees (watch the negative value of Math.PI here `-Math.PI / 2`

const painting6 = createPainting(
    '/artworks/5.jpg',
    10,
    5,
    new THREE.Vector3(-19.99, 5, 10)
);
painting6.rotation.y = Math.PI / 2; // Γυρνάμε τον πίνακα 90 μοίρες ώστε να είναι στον αριστερό τοίχο.


scene.add(painting1, painting2, painting3, painting4, painting5, painting6);  //βάζουμε τους πίνακες στη σκηνή

// Controls
const controls = new PointerLockControls(camera, document.body); //δημιουργία των controls για τις κινήσεις

// Τα controls είναι ενεργοποιημένα όταν κρύβουμε το Menu.
function startExperience() {
  controls.lock();
  // Hide menu
  hideMenu();
}

const playButton = document.getElementById('play_button');
playButton.addEventListener('click', startExperience);

// Hide menu
function hideMenu() {
  const menu = document.getElementById('menu');
  menu.style.display = 'none';
}

// Show menu
function showMenu() {
  const menu = document.getElementById('menu');
  menu.style.display = 'block';
}

controls.addEventListener('unlock', showMenu);

// Προσθήκη κίνησης για τον χρήστη στον χώρο (WASD)
function onKeyDown(event) {
  let keycode = event.which;

  // Δεξιά με D
  if (keycode === 39 || keycode === 68) {
    controls.moveRight(0.08);
  }
  // Αριστερά με A
  else if (keycode === 37 || keycode === 65) {
    controls.moveRight(-0.08);
  }
  // Μπροστά με W
  else if (keycode === 38 || keycode === 87) {
    controls.moveForward(0.08);
  }
  // Πίσω με S
  else if (keycode === 40 || keycode === 83) {
    controls.moveForward(-0.08);
  }
}

//άλλαξα την renderer γιατι για το webxr χρειαζόμαστε αλλη εντολη
/*let render = function () {

  renderer.render(scene, camera); //κάνουμε render τη σκηνή μας και την κάμερα αλλιώς δε θα βλέπουμε τίποτα


  requestAnimationFrame(render);
};*/

//άλλαξα τη renderer γιατί για το web xr χρειαζόμαστε άλλη εντολή

renderer.setAnimationLoop(function (){

  renderer.render(scene, camera); //κάνουμε render τη σκηνή μας και την κάμερα αλλιώς δε θα βλέπουμε τίποτα

});
//render();
