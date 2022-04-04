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
import Button from "@mui/material/Button";
import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

// var clock = new Clock();

const modalBoxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Data {
  image: string;
  value: number;
}

function randomIntFromInterval(min: any, max: any) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomCameraPoint() {
  return Math.random() * randomIntFromInterval(-4, 4);
}

function getRandomCameraZoom() {
  return Math.random() * randomIntFromInterval(25, 30);
}

type Props = {
  needleRotation: number;
};
export const ModelViewer: FC<Props> = ({ needleRotation }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  let renderer = useRef<WebGLRenderer>();
  // const rotationAnimatedValue = useRef(0);
  const [canWeAnimateNeedle, setCanWeAnimateNeedle] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<string>();
  const [newValue, setNewValue] = useState<number>(0);
  const [data, setData] = useState<Data[]>([]);

  const counter = useRef(0);
  const imageCounter = useRef(0);
  const [maxImages, setMaxImages] = useState<number>(50);
  const [maxValue, setMaxValue] = useState<number>(100);
  const [minValue, setMinValue] = useState<number>(0);

  const [modalImage, setmodalImage] = useState<string>("");
  const [modalText, setModalText] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const handleOpen = (image: string, value: number) => {
    setmodalImage(image);
    let ratio,
      result = 0;
    if (value > 0.8 && value < 5.5) {
      ratio = (value - 0.8) / (5.5 - 0.8);
      result = ratio * (maxValue - minValue);
    }
    setModalText(result);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const saveAsImage = (): string => {
    // console.log("save");
    let imgData, imgNode;

    try {
      var strMime = "image/jpeg";
      imgData = renderer?.current?.domElement.toDataURL(strMime);
      if (imgData) {
        return imgData;
      }
      return "";
      // if (images && imgData) {
      //   setImages([...images, imgData]);
      //   console.log(images);
      // }
      // console.log(imgData);
    } catch (e) {
      console.log(e);
      return "";
    }
  };

  function getRandomValue(max: number) {
    const result = Math.random() * max;
    setNewValue(result);
    return result;
  }

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

    // var colorAnim = new ColorKeyframeTrack(
    //   ".material.color",
    //   [0, 2, 3, 4, 5],
    //   [0xff0000, 0xaa00aa, 0x0000ff, 0x00aaaa, 0x00ff00]
    // );
    // var colorClip = new AnimationClip(undefined, 5, [colorAnim]);
    // var colorMixer = new AnimationMixer(gauge);
    // var colorAction = colorMixer.clipAction(colorClip);
    // colorAction.play();

    new Resizer(container, camera, renderer?.current);

    setNewValue(needleRotation);

    // renderer?.current?.render(scene, camera); // TODO: might need this

    // TODO: remove animation
    var animate = function (timestamp?: number) {
      controls.update();

      // console.log("camera", camera.position);

      // var delta = clock.getDelta();
      // TODO: move the needle
      // needleRotation = somethiung new
      // update needle rotation3

      if (canWeAnimateNeedle) {
        // console.log("rotation", rotationAnimatedValue.current);
        camera.position.set(
          getRandomCameraPoint(),
          getRandomCameraPoint(),
          getRandomCameraZoom()
        );
        rotateAboutPoint(
          needle,
          new Vector3(3 / 2, 0, 0), // mesh vector
          new Vector3(0, 1, 0), //rotation vector
          // needleRotation,
          getRandomValue(6.28),
          // (rotationAnimatedValue.current += (1 * Math.PI) / 180),
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
          // console.log("here!!!!!");
          if (imageCounter.current < maxImages) {
            // console.log(imageCounter.current, maxImages);
            setNewImage(saveAsImage());
            imageCounter.current += 1;
          } else {
            setCanWeAnimateNeedle(false);
          }
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

  useEffect(() => {
    if (!newImage) return;
    setImages([...images, newImage]);
    const newData: Data = { image: newImage, value: newValue };
    setData([...data, newData]);
    // console.log(data);
  }, [newImage]);

  const handleChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxImages(event.target.value as unknown as number);
  };

  const handleChangeMaxValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxValue(event.target.value as unknown as number);
  };

  const handleChangeMinValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinValue(event.target.value as unknown as number);
  };

  return (
    <>
      <div style={{ width: "25%", margin: "auto" }}>
        <div ref={mountRef} style={{ height: "500px" }}></div>
        <Button
          onClick={() => {
            setNewImage(saveAsImage());
          }}
        >
          Take screenshot
        </Button>
        <Button onClick={toggleNeedleAnimation}>Create data</Button>
        <TextField
          id="outlined-name"
          label="Image count"
          value={maxImages}
          onChange={handleChangeMax}
        />
        <TextField
          id="outlined-name"
          label="Min value"
          value={minValue}
          onChange={handleChangeMaxValue}
        />
        <TextField
          id="outlined-name"
          label="Max value"
          value={maxValue}
          onChange={handleChangeMinValue}
        />
      </div>
      <ImageList
        sx={{ width: "100%", height: "100%" }}
        cols={10}
        rowHeight={164}
      >
        {data &&
          data.map((item, i) => {
            return (
              <ImageListItem key={i}>
                <img
                  key={i}
                  alt={`gauge ${i}`}
                  src={item.image}
                  style={{ height: "50px" }}
                  onClick={() => {
                    handleOpen(item.image, item.value);
                  }}
                ></img>
              </ImageListItem>
            );
          })}
      </ImageList>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <img
            alt={`gauge-modal`}
            src={modalImage}
            style={{ height: "100%", width: "100%" }}
          ></img>
          <pre>
            {JSON.stringify(
              {
                value: modalText as unknown as number,
                min: minValue,
                max: maxValue,
              },
              undefined,
              2
            )}
          </pre>
        </Box>
      </Modal>
    </>
  );
};
