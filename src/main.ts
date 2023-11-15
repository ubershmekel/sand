// import './style.css'

import * as BABYLON from 'babylonjs';

import HavokPhysics from "@babylonjs/havok";


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="fps"></div>
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
  var createScene = async function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -5), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // initialize plugin
    // var hk = new BABYLON.HavokPlugin();
    // enable physics in the scene with a gravity
    scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), physicsPlugin);

    // Create a sphere shape and the associated body. Size will be determined automatically.
    // Our built-in 'sphere' shape.
    // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    // sphere.position.y = 4;
    // var sphereAggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);
    const sandy = new BABYLON.StandardMaterial("sandy", scene);
    sandy.diffuseColor = BABYLON.Color3.FromHexString("#cda34d");
    const tub = new BABYLON.StandardMaterial("tub", scene);
    tub.diffuseColor = BABYLON.Color3.FromHexString("#3d3d9d");
    //  new BABYLON.Color3(0.7, 0.7, 0.1);

    for (let i = 0; i < 1000; i++) {
      // const sphere = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);
      const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.2, segments: 16 }, scene);
      sphere.material = sandy;
      sphere.position.x = Math.random() * 2;
      sphere.position.z = Math.random() * 2;
      sphere.position.y = 0.5 + Math.random() * 2;
      // sphere.position.y = i * 0.1 + 4;
      const spherePhysics = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.05 }, scene);
    }

    const result = await BABYLON.SceneLoader.ImportMeshAsync(['Cylinder'], "https://raw.githubusercontent.com/thgala/public-assets/main/", "c1.babylon", scene);
    const element = result.meshes[0];
    element.material = tub;
    element.position.x = 0.5
    element.position.z = 0.5
    element.position.y = 0.7;
    const cylScale = 15;
    element.scaling.x = cylScale;
    element.scaling.y = 1;
    element.scaling.z = cylScale;
    const cylinderPhysics = new BABYLON.PhysicsAggregate(element, BABYLON.PhysicsShapeType.MESH, { mass: 1000, restitution: 0.15 }, scene);

    // const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 2, diameterTop: 2, diameterBottom: 2, tessellation: 8, subdivisions: 8 }, scene);

    // Create a static box shape.
    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
    var groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);

    return scene;
  };

  // const physicsPlugin = new BABYLON.HavokPlugin();
  const havok = await HavokPhysics();
  const physicsPlugin = new BABYLON.HavokPlugin(true, havok);
  const scene = await createScene();
  scene.enablePhysics(gravityVector, physicsPlugin);

  // run the render loop
  engine.runRenderLoop(function () {
    scene.render();
    divFps.innerHTML = engine.getFps().toFixed() + " fps";
  });
  // the canvas/window resize event handler
  window.addEventListener('resize', function () {
    engine.resize();
  });

  let divFps = document.getElementById("fps") as HTMLElement;


}

init();