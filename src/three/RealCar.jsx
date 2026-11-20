// Real glTF Mahindra models (CC-BY 4.0, credits in README and footer).
// Normalised to a common scale on the turntable; paint, roof and rims are recoloured live,
// and the accessory kit snaps on using the measured body size.
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Accessories } from "./Vehicle";

export const REAL = {
  roxx: { url: "models/thar-roxx.glb", len: 4.43, paint: /carpaint/i, roof: /roof_color/i, rim: /rim_ring/i, flip: true },
  thar: { url: "models/thar-og.glb", len: 3.98, paint: /aiStandardSurface(21|33)SG/, roof: null, rim: null, flip: false },
};

export default function RealCar({ model, paint, rim, roof = "black", acc = {}, lights = false }) {
  const spec = REAL[model];
  const { scene } = useGLTF("./" + spec.url);

  // clone once per model, normalise orientation/scale/position, collect recolourable materials
  const { root, dims, mats } = useMemo(() => {
    const root = scene.clone(true);
    const mats = { paint: [], roof: [], rim: [] };
    root.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      const list = Array.isArray(o.material) ? o.material : [o.material];
      const cloned = list.map((m) => {
        const c = m.clone();
        if (spec.paint?.test(m.name)) { mats.paint.push(c); c.metalness = 0.55; c.roughness = 0.25; if ("clearcoat" in c) c.clearcoat = 1; }
        if (spec.roof?.test(m.name)) mats.roof.push(c);
        if (spec.rim?.test(m.name)) mats.rim.push(c);
        return c;
      });
      o.material = Array.isArray(o.material) ? cloned : cloned[0];
    });
    const wrap = new THREE.Group();
    wrap.add(root);
    let box = new THREE.Box3().setFromObject(wrap);
    let size = box.getSize(new THREE.Vector3());
    if (size.z > size.x) { root.rotation.y = Math.PI / 2; }
    if (spec.flip) root.rotation.y += Math.PI;
    wrap.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(wrap);
    size = box.getSize(new THREE.Vector3());
    const k = spec.len / size.x;
    root.scale.multiplyScalar(k);
    wrap.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(wrap);
    const c = box.getCenter(new THREE.Vector3());
    root.position.x -= c.x;
    root.position.z -= c.z;
    root.position.y -= box.min.y;
    wrap.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(wrap);
    size = box.getSize(new THREE.Vector3());
    return { root: wrap, dims: size, mats };
  }, [scene, spec]);

  // live recolour
  mats.paint.forEach((m) => m.color.set(paint));
  mats.roof.forEach((m) => m.color.set(roof === "body" ? paint : "#151617"));
  mats.rim.forEach((m) => m.color.set(rim));

  const L = dims.x, W = dims.z, H = dims.y;
  const d = {
    front: L / 2, w: W * 0.92, roofTop: H - 0.04, roofX: -L * 0.08, roofLen: L * 0.46,
    bodyY: H * 0.42, bodyH: H * 0.34, top: H * 0.58, snorkelX: L * 0.12, wheelX: [L * 0.32, -L * 0.32],
  };
  // the real body already has bumpers and steps; only add the kit pieces it lacks
  return (
    <group>
      <primitive object={root} />
      <Accessories acc={{ ...acc, steps: false }} lights={lights} d={d} />
      {lights && <pointLight position={[L / 2 + 1.4, H * 0.45, 0]} intensity={18} distance={7} color="#e9f1ff" />}
    </group>
  );
}

useGLTF.preload("./" + REAL.roxx.url);
