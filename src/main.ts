// import './style.css'

import * as BABYLON from 'babylonjs';

import HavokPhysics from "@babylonjs/havok";


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="fps"></div>
<canvas id="renderCanvas" style="width:100%;height:100%;touch-action:none;"></canvas>
`

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

class Game {
  comb!: BABYLON.Mesh;
  combP!: BABYLON.PhysicsAggregate;
  engine!: BABYLON.Engine;
  canvas!: HTMLCanvasElement;
  physicsPlugin!: BABYLON.HavokPlugin;

  async init() {
    // Get the canvas DOM element
    this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    // Load the 3D engine
    this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
    // CreateScene function that creates and return the scene

    // var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0, -9.81, 0);

    // const physicsPlugin = new BABYLON.HavokPlugin();
    const havok = await HavokPhysics();
    this.physicsPlugin = new BABYLON.HavokPlugin(true, havok);
    const scene = await this.createScene();
    scene.enablePhysics(gravityVector, this.physicsPlugin);

    // run the render loop
    this.engine.runRenderLoop(() => {
      scene.render();
      divFps.innerHTML = this.engine.getFps().toFixed() + " fps";
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    let divFps = document.getElementById("fps") as HTMLElement;

    scene.registerBeforeRender(() => {
      this.beforeRender();
    });
  }

  beforeRender() {
    // console.log("before render", this);
    if (!this.comb) return;
    // console.log("combing")
    this.comb.position.x = Math.sin(Date.now() / 1000) * 1.5 + .5;
    // this.comb.position.y = Math.sin(Date.now() / 1000) * .5;
    this.comb.position.z = Math.cos(Date.now() / 1000) * 1.5;
    // this.combP.body.setLinearVelocity(new BABYLON.Vector3(.1, 0, 0));
    // this.combP.transformNode.position.x = Math.sin(Date.now() / 1000) * 0.5;

  }

  async createScene() {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(this.engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -5), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(this.canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // initialize plugin
    // var hk = new BABYLON.HavokPlugin();
    // enable physics in the scene with a gravity
    scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), this.physicsPlugin);

    // Create a sphere shape and the associated body. Size will be determined automatically.
    // Our built-in 'sphere' shape.
    // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    // sphere.position.y = 4;
    // var sphereAggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);
    const sandy = new BABYLON.StandardMaterial("sandy", scene);
    // sandy.diffuseColor = BABYLON.Color3.FromHexString("#cda34d");
    sandy.diffuseTexture = new BABYLON.Texture("14-grain-sand-seamless.jpg", scene);
    sandy.specularColor = BABYLON.Color3.FromHexString("#1d1d1d");
    const tubMaterial = new BABYLON.StandardMaterial("tub", scene);
    tubMaterial.diffuseColor = BABYLON.Color3.FromHexString("#3d3d9d");
    const reddish = new BABYLON.StandardMaterial("reddish", scene);
    reddish.diffuseColor = BABYLON.Color3.FromHexString("#cd3d3d");
    //  new BABYLON.Color3(0.7, 0.7, 0.1);

    for (let i = 0; i < 1000; i++) {
      // const sphere = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);
      const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.25, segments: 4 }, scene);
      sphere.material = sandy;
      sphere.position.x = Math.random() * 2;
      sphere.position.z = Math.random() * 2;
      sphere.position.y = 0.5 + Math.random() * 2;
      // sphere.position.y = i * 0.1 + 4;
      new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.05 }, scene);
    }

    // was "https://raw.githubusercontent.com/thgala/public-assets/main/", "c1.babylon"
    const result = await BABYLON.SceneLoader.ImportMeshAsync(['Cylinder'], "", "c1.babylon", scene);
    const tub = result.meshes[0];
    tub.material = tubMaterial;
    tub.position.x = 0.5
    tub.position.z = 0.5
    tub.position.y = 0.7;
    const cylScale = 15;
    tub.scaling.x = cylScale;
    tub.scaling.y = 1;
    tub.scaling.z = cylScale;
    new BABYLON.PhysicsAggregate(tub, BABYLON.PhysicsShapeType.MESH, { mass: 1000, restitution: 0.15 }, scene);

    // const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 2, diameterTop: 2, diameterBottom: 2, tessellation: 8, subdivisions: 8 }, scene);

    // Create a static box shape.
    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
    new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);

    // this.comb = BABYLON.MeshBuilder.CreateBox("comb", { width: 0.3, height: 3, depth: 0.3 }, scene);
    // this.combP = new BABYLON.PhysicsAggregate(this.comb, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);
    this.comb = BABYLON.MeshBuilder.CreateCylinder("comb", { diameter: 0.5, height: 3.5 }, scene);
    this.combP = new BABYLON.PhysicsAggregate(this.comb, BABYLON.PhysicsShapeType.CYLINDER, { mass: 0 }, scene);
    this.combP.body.disablePreStep = false;
    this.comb.material = reddish;
    console.log("the comb", this.comb);
    console.log("this", this);

    return scene;

  }
}


const game = new Game();
game.init();