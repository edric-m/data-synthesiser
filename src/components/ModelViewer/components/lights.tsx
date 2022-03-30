import { DirectionalLight, HemisphereLight } from "three";

function createLights() {
  // Create a directional light
  const light = new DirectionalLight("white", 3);
  const light2 = new DirectionalLight("white", 1);

  // move the light right, up, and towards us
  light.position.set(0, 10, 10);
  // light.position.set(40, 30, 50);
  light2.position.set(-40, -30, -50);

  // const ambientLight = new HemisphereLight(
  //   "white", // bright sky color
  //   "darkslategrey", // dim ground color
  //   1 // intensity
  // );

  // const ambientLight = new HemisphereLight(
  //   "white", // bright sky color
  //   "darkslategrey", // dim ground color
  //   5 // intensity
  // );

  return [light, light2];
}

export { createLights };
