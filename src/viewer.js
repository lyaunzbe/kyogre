import THREE from 'three'
import loop from 'raf-loop'

import assign from 'object-assign'
import domready from 'domready'
import fitter from 'canvas-fit'

import FboMaterial from './fbo'
import TexturePlane from './texplane'
import Toolbelt from './shaders/toolbelt/index'

const OrbitControls = require('three-orbit-controls')(THREE)

var glslify = require('glslify')


export default function(opt, vid, vid2) {
  let mouse = new THREE.Vector2();
  let mouseX, mouseY, unMappedMouseX, unMappedMouseY;
  opt = assign({}, opt)

  let time = 0;

  const dpr = Math.min(2, window.devicePixelRatio)
  const canvas = opt.canvas || document.createElement('canvas')
  const fit = fitter(canvas, window, dpr)

  const renderer = new THREE.WebGLRenderer(assign({
    canvas: canvas
  }, opt));


  let scene, camera, texture, material, controls;

  let texturePlane, texturePlane2, texturePlane3, texturePlane4;

  let angle = 0,
	speed = 0.02,
	centerY = 20,
	waveHeight = 150;

  let vidTex = new THREE.Texture( vid );
  vidTex.minFilter = THREE.LinearFilter;
	vidTex.magFilter = THREE.LinearFilter;
	vidTex.format = THREE.RGBFormat;

  let vidTex2 = new THREE.Texture( vid2 );
  vidTex2.minFilter = THREE.LinearFilter;
	vidTex2.magFilter = THREE.LinearFilter;
	vidTex2.format = THREE.RGBFormat;


  // let fboTex = new THREE.Texture(canvasTexture.canvas);
  // fboTex.needsUpdate = true;

  const gl = renderer.getContext();

  const app = loop(draw);


  assign(app, {
    renderer,
    gl,
    canvas
  })

  window.addEventListener('resize', resize, false)
  document.addEventListener('mousemove', onDocumentMouseMove, false );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x577fb6, 1)

  process.nextTick(resize)

  init();

  return app


  function init () {
    console.log('YO');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20000 );
    // camera = new THREE.OrthographicCamera(window.innerWidth/ - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -100000, 100000 );
    controls = new OrbitControls(camera, canvas);
    console.log(camera.zoom);
    camera.position.z = 900;
    // let ambientLight = new THREE.AmbientLight( 0xffffff );
    // scene.add( ambientLight );
    texturePlane = new TexturePlane(scene, camera, renderer, vidTex, vidTex2, null);
    texturePlane2 = new TexturePlane(scene, camera, renderer, vidTex, vidTex2, null);
    texturePlane3 = new TexturePlane(scene, camera, renderer, vidTex, vidTex2, null);
    texturePlane4 = new TexturePlane(scene, camera, renderer, vidTex, vidTex2, null);
    console.log(texturePlane.material)
    camera.lookAt(new THREE.Vector3(0,0,0))

    texturePlane.setPosition(new THREE.Vector3(0,0,0))
    texturePlane2.setPosition(new THREE.Vector3(0,0,100))
    texturePlane3.setPosition(new THREE.Vector3(0,0,200))
    texturePlane4.setPosition(new THREE.Vector3(0,0,300))
    // scene.add( cube );
    // camera.position.copy(new THREE.Vector3(0, 0, -1.6))
    // camera.lookAt(new THREE.Vector3())
    // camera.lookAt(texturePlane.position)
  }

  function draw () {
    app.emit('render')

    time += 0.01;
    // console.log(time);


    vidTex.needsUpdate = true;
    vidTex2.needsUpdate = true;

    let timeInCurrentMin = time.toFixed(0) > 60.0 ? (time.toFixed(0) - (Math.floor(time.toFixed(0)/60)*60)) : time.toFixed(0);
    // console.log(timeInCurrentMin);

    if (timeInCurrentMin >= 0.0 && timeInCurrentMin <= 10.0) {
      // texturePlane.setRotation(new THREE.Vector3(-1,0,0))
      // texturePlane2.setRotation(new THREE.Vector3(-1,0,0))
      // texturePlane3.setRotation(new THREE.Vector3(-1,0,0))
      // texturePlane4.setRotation(new THREE.Vector3(-1,0,0))

      texturePlane.setPosition(new THREE.Vector3(0,0,0))
      texturePlane2.setPosition(new THREE.Vector3(0,0,100))
      texturePlane3.setPosition(new THREE.Vector3(0,0,200))
      texturePlane4.setPosition(new THREE.Vector3(0,0,300))
      camera.position.set(0, -1500,600);
      camera.lookAt(new THREE.Vector3(0,0,0))
      texturePlane.update(new THREE.Vector3(1.0, 0,0), null)
      texturePlane2.update(new THREE.Vector3(0,0,0.01), null)
      texturePlane3.update(new THREE.Vector3(0,0,0.1), null)
      texturePlane4.update(new THREE.Vector3(0,0,0.01), null)
      // texturePlane.update(null ,new THREE.Vector3(-0.01,0,0))
      // texturePlane2.update(null ,new THREE.Vector3(-0.001,0,0))
      // texturePlane3.update(null ,new THREE.Vector3(-0.001,0,0))
      // texturePlane4.update(null ,new THREE.Vector3(-0.01,0,0))
      // camera.rotation.x += 0.01;
      camera.position.z = 600 + (Math.sin(time/10)*-200);

      camera.position.y = -900 + (Math.sin(time/10)*-500);
    }

    else if (timeInCurrentMin >= 10.0 && timeInCurrentMin <= 20.0) {
      texturePlane.setRotation(new THREE.Vector3(0,0,0))
      texturePlane2.setRotation(new THREE.Vector3(0,0,0))
      texturePlane3.setRotation(new THREE.Vector3(0,0,0))
      texturePlane4.setRotation(new THREE.Vector3(0,0,0))
      camera.position.set(0, 0, 900);
      camera.lookAt(new THREE.Vector3(0,0,0))
      texturePlane.update(null ,new THREE.Vector3(0,0,0))
      texturePlane2.update(null ,new THREE.Vector3(0,0,0))
      texturePlane3.update(null ,new THREE.Vector3(0,0,0))
      texturePlane4.update(null ,new THREE.Vector3(0,0,0))
      // camera.rotation.x += 0.01;
      camera.position.z = 900 + (Math.sin(time)*400);
    }
     else if (timeInCurrentMin >= 20.0 && timeInCurrentMin <= 30.0) {

      camera.position.set(0, 0, 900);
      camera.lookAt(new THREE.Vector3(0,0,0))
      texturePlane.update(null ,new THREE.Vector3(-0.01,0,0))
      texturePlane2.update(null ,new THREE.Vector3(0.01,0,0))
      texturePlane3.update(null ,new THREE.Vector3(-0.01,0,0))
      texturePlane4.update(null ,new THREE.Vector3(0.01,0,0))

      camera.rotation.x += 0.01;
      camera.position.z = 900 + (Math.sin(time)*50);
      angle += speed;
      camera.position.y = centerY + (Math.sin(angle) * waveHeight);
    }else{
      texturePlane.setRotation(new THREE.Vector3(0,0,0))
      texturePlane2.setRotation(new THREE.Vector3(0,0,0))
      texturePlane3.setRotation(new THREE.Vector3(0,0,0))
      texturePlane4.setRotation(new THREE.Vector3(0,0,0))
      texturePlane.update(null ,new THREE.Vector3(-0.01,-0.01,0))
      texturePlane2.update(null ,new THREE.Vector3(-0.01,-0.01,0))
      texturePlane3.update(null ,new THREE.Vector3(-0.01,-0.01,0))
      texturePlane4.update(null ,new THREE.Vector3(-0.01,-0.01,0))

      camera.position.set(0, 0, 0); //move to world center
      camera.rotation.y += 0.01; //rotate camera around world center
      camera.translateZ(900);

      angle += speed;
      camera.position.y = centerY + (Math.sin(angle) * waveHeight);
    }

    texturePlane.material.uniforms.mouse.value = new THREE.Vector2(unMappedMouseX, unMappedMouseY);
    texturePlane.material.uniforms.time.value = time;

    texturePlane2.material.uniforms.mouse.value = new THREE.Vector2(unMappedMouseX, unMappedMouseY);
    texturePlane2.material.uniforms.time.value = time;

    texturePlane3.material.uniforms.mouse.value = new THREE.Vector2(unMappedMouseX, unMappedMouseY);
    texturePlane3.material.uniforms.time.value = time;

    texturePlane4.material.uniforms.mouse.value = new THREE.Vector2(unMappedMouseX, unMappedMouseY);
    texturePlane4.material.uniforms.time.value = time;

    renderer.render(scene, camera);
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
  }

  function onDocumentMouseMove( event ) {
    mouse.x = ( event.clientX - window.innerWidth / 2 ) * 8;
    mouse.y = ( event.clientY - window.innerHeight / 2 ) * 8;

    unMappedMouseX = (event.clientX );
    unMappedMouseY = (event.clientY );
    mouseX = map(unMappedMouseX, window.innerWidth, -1.0,1.0);
    mouseY = map(unMappedMouseY, window.innerHeight, -1.0,1.0);
  }

}
