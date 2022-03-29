import {
  Color,
  CylinderBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  TextureLoader,
} from "three";

function createObject() {
  // create a geometry
  const geometry = new CylinderBufferGeometry(5, 5, 2, 30);
  const texture = new TextureLoader().load(
    "http://localhost:8080/gauge_psi.png"
  );

  // create material
  const material = new MeshPhongMaterial({
    color: new Color("white"),
    map: texture,
  });
  material.specular = new Color("white");
  material.shininess = 100;

  // create a Mesh containing the geometry and material
  const object = new Mesh(geometry, material);

  return object;
}

export { createObject };
