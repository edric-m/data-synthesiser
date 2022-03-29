import { DirectionalLight } from "three";

function createLights() {
  // Create a directional light
  const light = new DirectionalLight("white", 3);
  const light2 = new DirectionalLight("white", 1);

  // move the light right, up, and towards us
  light.position.set(10, 10, 10);
  // light.position.set(40, 30, 50);
  light2.position.set(-40, -30, -50);

  return [light, light2];
}

export { createLights };
