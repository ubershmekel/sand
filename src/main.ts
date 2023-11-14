// import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

import * as BABYLON from 'babylonjs';

import HavokPhysics from "@babylonjs/havok";


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<canvas id="renderCanvas" style="width:100%;height:100%;touch-action:none;"></canvas>
`

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

async function init() {
  // Get the canvas DOM element
  let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  // Load the 3D engine
  var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
  // CreateScene function that creates and return the scene

  // var scene = new BABYLON.Scene(engine);
  var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
  var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

    // Move the sphere upward at 4 units
    sphere.position.y = 4;

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

    // initialize plugin
    // var hk = new BABYLON.HavokPlugin();
    // enable physics in the scene with a gravity
    scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), physicsPlugin);

    // Create a sphere shape and the associated body. Size will be determined automatically.
    var sphereAggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);

    // Create a static box shape.
    var groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);

    return scene;
  };

  // const physicsPlugin = new BABYLON.HavokPlugin();
  const havok = await HavokPhysics();
  const physicsPlugin = new BABYLON.HavokPlugin(true, havok);
  const scene = createScene();
  scene.enablePhysics(gravityVector, physicsPlugin);

  // run the render loop
  engine.runRenderLoop(function () {
    scene.render();
  });
  // the canvas/window resize event handler
  window.addEventListener('resize', function () {
    engine.resize();
  });
}

init();