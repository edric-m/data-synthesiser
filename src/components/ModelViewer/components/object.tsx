import {
  BoxBufferGeometry,
  Color,
  CylinderBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Shape,
  TextureLoader,
  Vector3,
} from "three";

function createObject(needleRotation: number) {
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

  const needleLength = 3;
  // needle
  const needleGeo = new BoxBufferGeometry(needleLength, 0.4, 0.4);
  // needleGeo.rotateY(0.3);
  const needleMat = new MeshPhongMaterial({ color: new Color("red") });
  needleMat.specular = new Color("white");
  needleMat.shininess = 100;
  // create a Mesh containing the geometry and material
  const object = new Mesh(geometry, material);
  const needleMesh = new Mesh(needleGeo, needleMat);

  // console.log(
  //   needleMesh.position,
  //   needleMesh.position.add(new Vector3(-4, 0, 0))
  // );

  // const needleRotation = 1.57; // 45 deg
  // const needleRotation = 0;
  needleMesh.position.y += 1;
  rotateAboutPoint(
    needleMesh,
    new Vector3(needleLength / 2, 0, 0),
    new Vector3(0, 1, 0),
    needleRotation,
    true
  );

  // needleMesh.position.x += 3 / 2;
  // needleMesh.rotateOnAxis(new Vector3(0, 1, 0), needleRotation);

  return { gauge: object, needle: needleMesh };
}

function rotateAboutPoint(
  obj: any,
  point: any,
  axis: any,
  theta: any,
  pointIsWorld: any
) {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

  //reset position
  obj.position.x = 0;
  obj.position.y = 1;
  obj.position.z = 0;
  obj.rotation.x = 0;
  obj.rotation.y = 0;
  obj.rotation.z = 0;

  // reset take 2
  // obj.position.add(point);
  // obj.applyAxisAngle(axis, 0);
  // obj.position.sub(point);

  // if (pointIsWorld) {
  //   obj.parent.localToWorld(obj.position); // compensate for world coordinate
  // }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  // obj.position.add(point); // re-add the offset

  // if (pointIsWorld) {
  //   obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  // }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

export { createObject, rotateAboutPoint };
