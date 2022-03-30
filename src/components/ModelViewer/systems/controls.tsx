import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function createControls(camera: any, canvas: any) {
  const controls = new OrbitControls(camera, canvas);

  // damping and auto rotation require
  // the controls to be updated each frame

  // this.controls.autoRotate = true;
  controls.enableDamping = true;

  // controls.autoRotate = true;
  // controls.autoRotateSpeed = 1;

  return controls;
}

export { createControls };
