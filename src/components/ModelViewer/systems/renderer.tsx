import { WebGLRenderer } from "three";

function createRenderer() {
  const renderer = new WebGLRenderer({
    preserveDrawingBuffer: true,
    antialias: true,
  });

  // turn on the physically correct lighting model
  renderer.physicallyCorrectLights = true;

  return renderer;
}

export { createRenderer };
