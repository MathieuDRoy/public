import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export default function createUI(reticleGeometryParams, reticleColorParams, reticlePositionParams) {
  const gui = new GUI();

  const geometryFolder = gui.addFolder('Reticle Geometry');
  geometryFolder.add(reticleGeometryParams.innerRadius, 'value', 0.001, 0.02).name('Inner Radius');
  geometryFolder.add(reticleGeometryParams.outerRadius, 'value', 0.001, 0.02).name('Outer Radius');
  geometryFolder.add(reticleGeometryParams.sides, 'value', 3, 30, 1).name('Sides');
  geometryFolder.onChange(() => {
    drawReticle();
  });

  const colorFolder = gui.addFolder('Reticle Color');
  colorFolder.add(reticleColorParams.color.value, 'r', 0, 1).name('Red');
  colorFolder.add(reticleColorParams.color.value, 'g', 0, 1).name('Green');
  colorFolder.add(reticleColorParams.color.value, 'b', 0, 1).name('Blue');
  colorFolder.onChange(() => {
    drawReticle();
});

  const positionFolder = gui.addFolder('Reticle Position');
  positionFolder.add(reticlePositionParams.posx, 'value', -1, 1).name('X Position');
  positionFolder.add(reticlePositionParams.posy, 'value', -1, 1).name('Y Position');
  positionFolder.add(reticlePositionParams.posz, 'value', -1, 0).name('Z Position');
  positionFolder.add(reticlePositionParams.angle, 'value', -Math.PI, Math.PI).name('Angle');
  positionFolder.onChange(() => {
    drawReticle();
  });


}