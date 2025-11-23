import * as THREE from "three";

import TWEEN from "three/addons/libs/tween.module.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";

import { loadData } from "./loadData.js";

export async function initApp() {
  const table = [];

  const rows = await loadData();

  rows.forEach((r, index) => {
    const name = r[0];
    const photo = r[1];
    const age = r[2];
    const country = r[3];
    const interest = r[4];
    const networth = r[5];

    table.push(name);
    table.push(photo);
    table.push(age);
    table.push(country);
    table.push(interest);
    table.push(networth);
    table.push((index % 20) + 1); // columns: 20
    table.push(Math.floor(index / 20) + 1); // rows: 10
  });

  let camera, scene, renderer;
  let controls;

  const objects = [];
  const targets = { table: [], sphere: [], helix: [], grid: [] };

  init();
  animate();

  function init() {
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 3000;

    scene = new THREE.Scene();

    // table

    for (let i = 0; i < table.length; i += 8) {
      let name = table[i + 0];
      let photo = table[i + 1];
      let age = table[i + 2];
      let country = table[i + 3];
      let interest = table[i + 4];
      let networth = Number(table[i + 5]);

      const element = document.createElement("div");
      element.className = "element";

      const minNetWorth = 0;
      const maxNetWorth = 400000;
      let t = (networth - minNetWorth) / (maxNetWorth - minNetWorth);
      t = Math.max(0, Math.min(1, t));
      let hue = t * 120; // 0 to 120 , red to green
      element.style.border = `3px solid hsl(${hue}, 100%, 50%)`;
      element.style.backgroundColor = `hsla(${hue}, 100%, 50%, 0.2)`;

      const countryElement = document.createElement("div");
      countryElement.className = "country";
      countryElement.textContent = country;
      element.appendChild(countryElement);

      const interestElement = document.createElement("div");
      interestElement.className = "interest";
      interestElement.textContent = interest;
      element.appendChild(interestElement);

      const imgElement = document.createElement("img");
      imgElement.className = "symbol";
      imgElement.src = photo;
      element.appendChild(imgElement);

      const nameElement = document.createElement("div");
      nameElement.className = "name";
      nameElement.innerHTML = name;
      element.appendChild(nameElement);

      const ageElement = document.createElement("div");
      ageElement.className = "age";
      ageElement.innerHTML = age;
      element.appendChild(ageElement);

      const objectCSS = new CSS3DObject(element);
      objectCSS.position.x = Math.random() * 4000 - 2000;
      objectCSS.position.y = Math.random() * 4000 - 2000;
      objectCSS.position.z = Math.random() * 4000 - 2000;
      scene.add(objectCSS);

      objects.push(objectCSS);

      //

      const object = new THREE.Object3D();
      object.position.x = table[i + 6] * 140 - 1330;
      object.position.y = -(table[i + 7] * 180) + 990;

      targets.table.push(object);
    }

    // sphere

    const vector = new THREE.Vector3();

    for (let i = 0, l = objects.length; i < l; i++) {
      const phi = Math.acos(-1 + (2 * i) / l);
      const theta = Math.sqrt(l * Math.PI) * phi;

      const object = new THREE.Object3D();

      object.position.setFromSphericalCoords(800, phi, theta);

      vector.copy(object.position).multiplyScalar(2);

      object.lookAt(vector);

      targets.sphere.push(object);
    }

    // helix

    for (let i = 0, l = objects.length; i < l; i++) {
      const theta = i * 0.175 + Math.PI;
      const y = -(i * 8) + 450;

      const object = new THREE.Object3D();

      object.position.setFromCylindricalCoords(900, theta, y);

      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;

      object.lookAt(vector);

      targets.helix.push(object);
    }

    // grid

    for (let i = 0; i < objects.length; i++) {
      const object = new THREE.Object3D();

      object.position.x = (i % 5) * 400 - 800; // x: 5 items
      object.position.y = -(Math.floor(i / 5) % 4) * 400 + 800; // y: 4 rows, moves down every 5 items
      object.position.z = Math.floor(i / (5 * 4)) * 1000 - 2000; // z: after 20, start new layer

      targets.grid.push(object);
    }

    //

    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(renderer.domElement);

    //

    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 10000;
    controls.addEventListener("change", render);

    const buttonTable = document.getElementById("table");
    buttonTable.addEventListener("click", function () {
      transform(targets.table, 2000);
    });

    const buttonSphere = document.getElementById("sphere");
    buttonSphere.addEventListener("click", function () {
      transform(targets.sphere, 2000);
    });

    const buttonHelix = document.getElementById("helix");
    buttonHelix.addEventListener("click", function () {
      transform(targets.helix, 2000);
    });

    const buttonGrid = document.getElementById("grid");
    buttonGrid.addEventListener("click", function () {
      transform(targets.grid, 2000);
    });

    transform(targets.table, 2000);

    //

    window.addEventListener("resize", onWindowResize);
  }

  function transform(targets, duration) {
    TWEEN.removeAll();

    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      const target = targets[i];

      new TWEEN.Tween(object.position)
        .to(
          { x: target.position.x, y: target.position.y, z: target.position.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      new TWEEN.Tween(object.rotation)
        .to(
          { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }

    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(render)
      .start();
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
  }

  function animate() {
    requestAnimationFrame(animate);

    TWEEN.update();

    controls.update();
  }

  function render() {
    renderer.render(scene, camera);
  }
}
