import { FC, useEffect, useRef, useState } from "react";
import {
  Group,
  Vector3,
  WebGLRenderer,
  ColorKeyframeTrack,
  AnimationClip,
  AnimationMixer,
  Clock,
} from "three";
import { createCamera } from "./components/camera";
import { createLights } from "./components/lights";
import { createObject, rotateAboutPoint } from "./components/object";
import { createScene } from "./components/scene";
import { createSky } from "./components/sky";
import { createControls } from "./systems/controls";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/resizer";
// import { Camera, Material, Texture } from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

var clock = new Clock();

type Props = {
  needleRotation: number;
};
export const ModelViewer: FC<Props> = ({ needleRotation }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  let renderer = useRef<WebGLRenderer>();
  const rotationAnimatedValue = useRef(0);
  const [canWeAnimateNeedle, setCanWeAnimateNeedle] = useState<boolean>(false);

  const counter = useRef(0);

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

  // const saveImages = () => {
  //   console.log("save");
  //   var imgData, imgNode;

  //   try {
  //     var strMime = "image/jpeg";
  //     imgData = renderer?.current?.domElement.toDataURL(strMime);
  //     console.log(imgData);
  //   } catch (e) {
  //     console.log(e);
  //     return;
  //   }
  // };

  const toggleNeedleAnimation = () => {
    setCanWeAnimateNeedle(!canWeAnimateNeedle);
  };

  useEffect(() => {
    const container = mountRef.current;

    const scene = createScene();
    const camera = createCamera();
    renderer.current = createRenderer();
    renderer?.current?.setSize(window.innerWidth, window.innerHeight);

    if (!container) return;
    if (renderer?.current) {
      container.appendChild(renderer.current.domElement);
    }

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

    var colorAnim = new ColorKeyframeTrack(
      ".material.color",
      [0, 2, 3, 4, 5],
      [0xff0000, 0xaa00aa, 0x0000ff, 0x00aaaa, 0x00ff00]
    );
    var colorClip = new AnimationClip(undefined, 5, [colorAnim]);
    var colorMixer = new AnimationMixer(gauge);
    var colorAction = colorMixer.clipAction(colorClip);
    colorAction.play();

    new Resizer(container, camera, renderer?.current);

    renderer?.current?.render(scene, camera);

    // TODO: remove animation
    var animate = function (timestamp?: number) {
      controls.update();

      console.log("camera", camera.position);

      var delta = clock.getDelta();
      // TODO: move the needle
      // needleRotation = somethiung new
      // update needle rotation3

      if (canWeAnimateNeedle) {
        // console.log("rotation", rotationAnimatedValue.current);
        rotateAboutPoint(
          needle,
          new Vector3(3 / 2, 0, 0), // mesh vector
          new Vector3(0, 1, 0), //rotation vector
          // needleRotation,
          (rotationAnimatedValue.current += (1 * Math.PI) / 180),
          true
        );
      }

      requestAnimationFrame(animate);

      // group.rotation.x += Math.PI * delta;
      // group.rotation.y += Math.PI * delta;

      // colorMixer.update(delta * colorMixer.timeScale);
      // requestAnimationFrame(animate);

      // object.rotation.x += 0.01;
      // object.rotation.y += 0.01;
      // object.rotation.z += 0.01;
      // new Resizer(container, camera, renderer);
      renderer?.current?.render(scene, camera);

      if (canWeAnimateNeedle) {
        counter.current += 1;
        if (counter.current > 10) {
          // do stuff
          console.log("here!!!!!");
          saveAsImage();
          counter.current = 0;
        }
      }
    };
    animate();

    // TODO: is this needed?
    return () => {
      if (!container) return;
      if (renderer?.current?.domElement) {
        container.removeChild(renderer?.current?.domElement);
      }
    };
  }, [needleRotation, canWeAnimateNeedle]);

  return (
    <div>
      <div ref={mountRef}></div>
      <button onClick={saveAsImage}>Take screenshot</button>
      <button onClick={toggleNeedleAnimation}>Toggle needle animation</button>
    </div>
  );
};
