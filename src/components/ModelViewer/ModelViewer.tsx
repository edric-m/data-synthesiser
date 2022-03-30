import { FC, useEffect, useRef } from "react";
import { Group, WebGLRenderer } from "three";
import { createCamera } from "./components/camera";
import { createLights } from "./components/lights";
import { createObject } from "./components/object";
import { createScene } from "./components/scene";
import { createSky } from "./components/sky";
import { createControls } from "./systems/controls";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/resizer";
// import { Camera, Material, Texture } from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Props = {
  needleRotation: number;
};
export const ModelViewer: FC<Props> = ({ needleRotation }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  let renderer = useRef<WebGLRenderer>();
  const saveAsImage = () => {
    console.log("save");
    var imgData, imgNode;

    try {
      var strMime = "image/jpeg";
      imgData = renderer?.current?.domElement.toDataURL(strMime);
      console.log(imgData);
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const test123 = () => {
    console.log("test123");
  };

  useEffect(() => {
    const container = mountRef.current;

    const scene = createScene();
    const camera = createCamera();
    renderer.current = createRenderer();

    renderer.current.setSize(window.innerWidth, window.innerHeight);

    if (!container) return;
    container.appendChild(renderer.current.domElement);

    const controls = createControls(camera, renderer.current.domElement);

    const { gauge, needle } = createObject(needleRotation);

    const sky = createSky();

    const group = new Group();
    group.add(gauge);
    group.add(needle);
    group.translateZ(-5);
    group.rotateX((90 * Math.PI) / 180);
    group.rotateY((90 * Math.PI) / 180);

    const lights = createLights();

    scene.add(sky, group, ...lights);

    new Resizer(container, camera, renderer?.current);

    renderer.current.render(scene, camera);

    // TODO: remove animation
    var animate = function () {
      controls.update();

      requestAnimationFrame(animate);
      // object.rotation.x += 0.01;
      // object.rotation.y += 0.01;
      // object.rotation.z += 0.01;
      // new Resizer(container, camera, renderer);
      renderer?.current?.render(scene, camera);
    };
    animate();

    // TODO: is this needed?
    return () => {
      if (!container) return;
      if (renderer?.current?.domElement) {
        container.removeChild(renderer?.current?.domElement);
      }
    };
  }, [needleRotation]);

  return (
    <div>
      <div ref={mountRef}></div>
      <button onClick={saveAsImage}>Take screenshot</button>
    </div>
  );
};
