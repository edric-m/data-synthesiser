import { FC, useEffect, useRef } from "react";
import { createCamera } from "./components/camera";
import { createLights } from "./components/lights";
import { createObject } from "./components/object";
import { createScene } from "./components/scene";
import { createControls } from "./systems/controls";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/resizer";
// import { Camera, Material, Texture } from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const ModelViewer: FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;

    const scene = createScene();
    const camera = createCamera();
    const renderer = createRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (!container) return;
    container.appendChild(renderer.domElement);

    const controls = createControls(camera, renderer.domElement);

    const object = createObject();
    const lights = createLights();

    scene.add(object, ...lights);

    new Resizer(container, camera, renderer);

    renderer.render(scene, camera);

    // TODO: remove animation
    var animate = function () {
      controls.update();

      requestAnimationFrame(animate);
      // object.rotation.x += 0.01;
      // object.rotation.y += 0.01;
      // object.rotation.z += 0.01;
      // new Resizer(container, camera, renderer);
      renderer.render(scene, camera);
    };
    animate();

    // TODO: is this needed?
    return () => {
      if (!container) return;
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
};
