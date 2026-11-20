// Configurator stage with two genuinely different moods:
//  Studio: bright launch-shoot cyclorama, soft glossy floor.
//  Night drive: moonlit, fog, stars, volumetric headlight beams.
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, SpotLight, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Vehicle, { BODIES } from "./Vehicle";

function Frame() {
  const { camera, size } = useThree();
  useFrame(() => {
    const off = size.width > 1024 ? size.width * 0.15 : 0;
    camera.setViewOffset(size.width, size.height, off, size.width > 1024 ? 0 : size.height * 0.1, size.width, size.height);
  });
  return null;
}

/* Two volumetric cones from the headlamps, aimed down the road. */
function Beams({ model }) {
  const b = BODIES[model] || BODIES.thar;
  const front = b.len / 2;
  const zs = [-(b.w / 2 - 0.3), b.w / 2 - 0.3];
  const left = useRef();
  const right = useRef();
  useLayoutEffect(() => {
    [left, right].forEach((r, i) => {
      if (!r.current) return;
      r.current.target.position.set(front + 2.6, 0, zs[i] * 1.3);
      r.current.target.updateMatrixWorld();
    });
  });
  return (
    <>
      {[left, right].map((r, i) => (
        <SpotLight key={i} ref={r} position={[front + 0.05, b.bodyY + 0.1, zs[i]]} color="#e9f1ff" angle={0.42} penumbra={0.6}
          distance={4.2} attenuation={3.2} anglePower={5} intensity={9} volumetric={false} castShadow={false} />
      ))}
    </>
  );
}

export default function Studio({ config, night = false, className = "" }) {
  const box = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);
  const bg = night ? "#04060a" : "#e9eaee";
  const model = config?.model || "thar";

  return (
    <div ref={box} className={className}>
      <Canvas frameloop={visible ? "always" : "never"} shadows dpr={[1, 1.25]} camera={{ position: [11, 3.1, 9.6], fov: 26 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: night ? 0.9 : 1.05 }}>
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, night ? 9 : 16, night ? 22 : 34]} />
        <Suspense fallback={null}>
          {night ? (
            <>
              <ambientLight intensity={0.04} />
              <directionalLight position={[-6, 8, -4]} intensity={0.55} color="#7f9cff" castShadow shadow-mapSize={[512, 512]} />
              <pointLight position={[-5, 2.5, 4]} intensity={6} color="#dd052b" distance={10} />
              <Stars radius={60} depth={20} count={1200} factor={3} saturation={0} fade speed={0.4} />
              <pointLight position={[(BODIES[model] || BODIES.thar).len / 2 + 1.2, 0.5, 0]} intensity={5} distance={4} color="#dfe8ff" />
            </>
          ) : (
            <>
              <ambientLight intensity={0.55} />
              <directionalLight position={[5, 9, 5]} intensity={1.6} castShadow shadow-mapSize={[512, 512]} />
            </>
          )}
          <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={night ? 0.25 : 2.4} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 2, 1]} />
            <Lightformer form="rect" intensity={night ? 0.15 : 1.4} position={[-8, 2, 0]} rotation-y={Math.PI / 2} scale={[14, 1.5, 1]} />
            <Lightformer form="rect" intensity={night ? 0.15 : 1.4} position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[14, 1.5, 1]} />
            <Lightformer form="ring" color={night ? "#5b78ff" : "#ffffff"} intensity={night ? 1.2 : 1} position={[0, 2, -9]} scale={5} />
          </Environment>

          <Vehicle {...config} lights={night || config?.lights} />
          <ContactShadows position={[0, 0.002, 0]} opacity={night ? 0.9 : 0.55} scale={10} blur={2.4} far={2} color="#000000" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
            <planeGeometry args={[80, 80]} />
            <meshStandardMaterial color={night ? "#0a0c11" : "#dcdee3"} roughness={night ? 0.95 : 0.55} metalness={0.05} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
            <ringGeometry args={[3.6, 3.63, 160]} />
            <meshBasicMaterial color="#dd052b" toneMapped={false} transparent opacity={night ? 0.9 : 0.6} />
          </mesh>
          <EffectComposer disableNormalPass>
            <Bloom mipmapBlur luminanceThreshold={night ? 0.92 : 1} intensity={night ? 1.5 : 0.4} />
            <Vignette offset={0.3} darkness={night ? 0.85 : 0.35} />
          </EffectComposer>
        </Suspense>
        <Frame />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.9} maxPolarAngle={1.45} target={[0, 0.95, 0]} autoRotate autoRotateSpeed={0.5} enableDamping />
      </Canvas>
    </div>
  );
}
