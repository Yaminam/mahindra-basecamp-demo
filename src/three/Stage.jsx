import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Vehicle from "./Vehicle";

/* Wireframe topographic terrain, flattened under the car so it reads as a turntable in the wild. */
function Terrain({ color = "#e0262f", opacity = 0.22 }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(70, 70, 140, 140);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const d = Math.sqrt(x * x + y * y);
      const h =
        Math.sin(x * 0.18) * Math.cos(y * 0.22) * 1.6 +
        Math.sin(x * 0.05 + y * 0.07) * 3.2 +
        Math.cos(y * 0.11 - x * 0.03) * 1.2;
      const falloff = THREE.MathUtils.smoothstep(d, 5, 16);
      p.setZ(i, h * falloff + falloff * 1.5);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
    </mesh>
  );
}

function Turntable({ night }) {
  return (
    <group>
      <mesh position={[0, -0.025, 0]} receiveShadow>
        <cylinderGeometry args={[3.4, 3.4, 0.05, 96]} />
        <meshPhysicalMaterial color={night ? "#0b0c0e" : "#fbfbfb"} metalness={0.1} roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[3.38, 3.41, 128]} />
        <meshBasicMaterial color="#dd052b" toneMapped={false} />
      </mesh>
    </group>
  );
}

/* Camera rig: orbits with scroll progress (a MotionValue) and drifts with the pointer. */
function Rig({ progress, base = 0.6, shift = 0.17 }) {
  const { camera, pointer, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 1.05, 0), []);
  useFrame((state, dt) => {
    const t = progress ? progress.get() : 0;
    const ang = base + t * Math.PI * 1.1 + pointer.x * 0.25 + state.clock.elapsedTime * 0.04;
    const r = 11 - t * 2.8;
    const y = 2.7 + pointer.y * 0.5 - t * 0.9;
    // push the car to the right on wide screens so the headline has room
    const off = size.width > 900 ? -size.width * shift * (1 - t) : 0;
    camera.setViewOffset(size.width, size.height, off, 0, size.width, size.height);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.cos(ang) * r, 3, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, Math.sin(ang) * r, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 3, dt);
    camera.lookAt(target);
  });
  return null;
}

/* Orbit mode: keep the car clear of the control panel on wide screens. */
function OrbitFrame() {
  const { camera, size } = useThree();
  useFrame(() => {
    const off = size.width > 1024 ? size.width * 0.16 : 0;
    camera.setViewOffset(size.width, size.height, off, size.width > 1024 ? 0 : size.height * 0.12, size.width, size.height);
  });
  return null;
}

function Lights({ night }) {
  return (
    <>
      <ambientLight intensity={night ? 0.08 : 0.6} />
      <directionalLight position={[5, 8, 4]} intensity={night ? 0.25 : 1.8} castShadow shadow-mapSize={[1024, 1024]} />
      {night && <pointLight position={[-4, 2, -3]} intensity={8} color="#dd052b" distance={12} />}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={night ? 0.4 : 2.2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 6, 1]} />
        <Lightformer form="rect" intensity={night ? 0.3 : 1.4} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={night ? 0.2 : 1.2} position={[6, 2, -2]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="ring" color="#e0262f" intensity={night ? 2 : 3} position={[0, 3, -8]} scale={4} />
      </Environment>
    </>
  );
}

export default function Stage({ config, progress, orbit = false, night = false, terrain = true, spin = 0, className = "", base, shift }) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: orbit ? [9.5, 3.4, 7.5] : [6, 2.4, 5], fov: 30 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <color attach="background" args={[night ? "#07080a" : "#eef0f2"]} />
        <fog attach="fog" args={[night ? "#07080a" : "#eef0f2", 11, 30]} />
        <Suspense fallback={null}>
          <Lights night={night} />
          <Vehicle {...config} lights={night || config?.lights} spin={spin} />
          <Turntable night={night} />
          {terrain && <Terrain color={night ? "#dd052b" : "#9ea3aa"} opacity={night ? 0.32 : 0.35} />}
          <ContactShadows position={[0, 0.005, 0]} opacity={night ? 0.75 : 0.5} scale={9} blur={2.4} far={2.5} color="#1a1c20" />
        </Suspense>
        {orbit ? (
          <><OrbitFrame /><OrbitControls enablePan={false} enableZoom={false} minDistance={9} maxDistance={14} minPolarAngle={0.5} maxPolarAngle={1.45} target={[0, 1, 0]} autoRotate autoRotateSpeed={0.6} enableDamping /></>
        ) : (
          <Rig progress={progress} base={base} shift={shift} />
        )}
      </Canvas>
    </div>
  );
}
