// Dark product studio for the configurator: mirror floor, overhead light strips, bloom.
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Vehicle from "./Vehicle";

/* keep the car clear of the side panel on wide screens */
function Frame() {
  const { camera, size } = useThree();
  useFrame(() => {
    const off = size.width > 1024 ? size.width * 0.15 : 0;
    camera.setViewOffset(size.width, size.height, off, size.width > 1024 ? 0 : size.height * 0.1, size.width, size.height);
  });
  return null;
}

function Strips({ night }) {
  // visible light bars overhead: they show up as long highlights in the paint and floor
  return (
    <group position={[0, 6.5, 0]}>
      {[-2.4, 0, 2.4].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9, 0.22]} />
          <meshBasicMaterial color={night ? "#ffb3be" : "#ffffff"} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function Studio({ config, night = false, className = "" }) {
  const bg = night ? "#050506" : "#0c0d10";
  // only render while on screen: keeps laptops cool when the configurator is scrolled away
  const box = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={box} className={className}>
      <Canvas frameloop={visible ? "always" : "never"} shadows dpr={[1, 1.25]} camera={{ position: [11, 3.1, 9.6], fov: 26 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, 12, 26]} />
        <Suspense fallback={null}>
          <ambientLight intensity={night ? 0.05 : 0.18} />
          <spotLight position={[0, 9, 0]} angle={0.5} penumbra={1} intensity={night ? 30 : 110} castShadow shadow-mapSize={[512, 512]} color="#ffffff" />
          <spotLight position={[-7, 3, -4]} angle={0.6} penumbra={1} intensity={night ? 40 : 60} color="#dd052b" />
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={night ? 0.6 : 3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 1, 1]} />
            <Lightformer form="rect" intensity={night ? 0.4 : 2} position={[0, 6, 2.4]} rotation-x={Math.PI / 2} scale={[10, 0.6, 1]} />
            <Lightformer form="rect" intensity={night ? 0.4 : 2} position={[0, 6, -2.4]} rotation-x={Math.PI / 2} scale={[10, 0.6, 1]} />
            <Lightformer form="rect" intensity={night ? 0.3 : 1.2} position={[-8, 2, 0]} rotation-y={Math.PI / 2} scale={[14, 1.5, 1]} />
            <Lightformer form="rect" intensity={night ? 0.3 : 1.2} position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[14, 1.5, 1]} />
            <Lightformer form="ring" color="#dd052b" intensity={night ? 4 : 2} position={[0, 2, -9]} scale={5} />
          </Environment>
          <Strips night={night} />
          <Vehicle {...config} lights={night || config?.lights} />
          <ContactShadows position={[0, 0.002, 0]} opacity={0.85} scale={10} blur={2.2} far={2} color="#000000" />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
            <planeGeometry args={[60, 60]} />
            <MeshReflectorMaterial blur={[200, 60]} resolution={384} mixBlur={1} mixStrength={night ? 30 : 18} roughness={0.85} depthScale={1.1} minDepthThreshold={0.4} maxDepthThreshold={1.3} color="#141518" metalness={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
            <ringGeometry args={[3.55, 3.58, 160]} />
            <meshBasicMaterial color="#dd052b" toneMapped={false} />
          </mesh>
          <EffectComposer disableNormalPass>
            <Bloom mipmapBlur luminanceThreshold={0.95} intensity={night ? 1.4 : 0.7} />
            <Vignette offset={0.25} darkness={0.75} />
          </EffectComposer>
        </Suspense>
        <Frame />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.9} maxPolarAngle={1.45} target={[0, 0.95, 0]} autoRotate autoRotateSpeed={0.5} enableDamping />
      </Canvas>
    </div>
  );
}
