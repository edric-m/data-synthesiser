import {
  BackSide,
  Mesh,
  MeshPhongMaterial,
  SphereGeometry,
  TextureLoader,
} from "three";

function createSky() {
  // create a geometry
  const skyGeo = new SphereGeometry(100, 55, 25);
  const texture = new TextureLoader().load("http://localhost:8080/sky3.jpg");

  // create material
  const material = new MeshPhongMaterial({
    map: texture,
    side: BackSide,
  });

  const sky = new Mesh(skyGeo, material);

  return sky;
}

export { createSky };
