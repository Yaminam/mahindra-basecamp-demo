// Parametric Mahindra-style vehicle: one rig, four body styles (Thar, Scorpio-N, XUV, Born Electric).
// Stand-in geometry until Mahindra's own configurator glTFs are plugged in; every accessory is its own group.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export const PAINTS = [
  { id: "red", name: "Rage Red", hex: "#a8111a" },
  { id: "forest", name: "Deep Forest", hex: "#2c3a2b" },
  { id: "grey", name: "Galaxy Grey", hex: "#585c61" },
  { id: "black", name: "Stealth Black", hex: "#141416" },
  { id: "white", name: "Everest White", hex: "#e6e4df" },
  { id: "blue", name: "Nebula Blue", hex: "#1f3552" },
];
export const RIMS = [
  { id: "silver", name: "Silver", hex: "#c9ccd1" },
  { id: "gun", name: "Gunmetal", hex: "#4a4d52" },
  { id: "black", name: "Satin Black", hex: "#1b1b1d" },
];

export const BODIES = {
  thar:    { name: "Thar",      len: 3.5, w: 1.72, bodyY: 0.99, bodyH: 0.74, hoodLen: 1.12, cabLen: 2.3,  cabX: -0.55, cabH: 0.8,  rakeF: 0.12, rakeR: 0.02, wheelX: [1.22, -1.18], tyre: 1,    spare: true,  lamp: "round",     grille: "slots",  flares: true,  rails: false },
  scorpio: { name: "Scorpio-N", len: 4.2, w: 1.84, bodyY: 1.02, bodyH: 0.78, hoodLen: 1.22, cabLen: 3.0,  cabX: -0.48, cabH: 0.76, rakeF: 0.32, rakeR: 0.08, wheelX: [1.45, -1.42], tyre: 1,    spare: false, lamp: "projector", grille: "chrome", flares: true,  rails: true },
  xuv:     { name: "XUV700",    len: 4.4, w: 1.86, bodyY: 0.92, bodyH: 0.66, hoodLen: 1.36, cabLen: 2.75, cabX: -0.55, cabH: 0.66, rakeF: 0.62, rakeR: 0.34, wheelX: [1.5, -1.5],   tyre: 0.95, spare: false, lamp: "slim",      grille: "wide",   flares: false, rails: true },
  ev:      { name: "BE 6",      len: 4.4, w: 1.88, bodyY: 0.86, bodyH: 0.6,  hoodLen: 1.42, cabLen: 2.55, cabX: -0.62, cabH: 0.56, rakeF: 0.82, rakeR: 0.78, wheelX: [1.52, -1.48], tyre: 0.98, spare: false, lamp: "ev",        grille: "closed", flares: false, rails: false },
};

const TRIM = "#141416";
function Paint({ color }) {
  return <meshPhysicalMaterial color={color} metalness={0.62} roughness={0.22} clearcoat={1} clearcoatRoughness={0.04} envMapIntensity={1.4} />;
}
function Trim({ color = TRIM, rough = 0.7 }) {
  return <meshStandardMaterial color={color} roughness={rough} metalness={0.2} />;
}
function Glow({ on, base = 2, hi = 6, color = "#ffffff" }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={on ? hi : base} toneMapped={false} />;
}

export function Wheel({ position, rotation, rim, spin = 0, scale = 1 }) {
  const ref = useRef();
  useFrame((_, d) => { if (spin && ref.current) ref.current.rotation.z -= d * spin; });
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={ref}>
        <mesh castShadow scale={[1, 1, 1.35]}>
          <torusGeometry args={[0.3, 0.115, 20, 48]} />
          <meshStandardMaterial color="#0e0e0f" roughness={0.95} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.235, 0.235, 0.27, 40]} />
          <meshStandardMaterial color={rim} metalness={0.85} roughness={0.28} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
            <boxGeometry args={[0.06, 0.42, 0.29]} />
            <meshStandardMaterial color={rim} metalness={0.85} roughness={0.3} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.31, 20]} />
          <meshStandardMaterial color="#202022" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
}

/* Glasshouse: side profile extruded across the width, so each body gets its own silhouette. */
function Cabin({ b, base, roofColor }) {
  const { glass, roof } = useMemo(() => {
    const c = b.cabLen, h = b.cabH, d = b.w - 0.1;
    const shape = new THREE.Shape();
    shape.moveTo(-c / 2, 0);
    shape.lineTo(c / 2, 0);
    shape.lineTo(c / 2 - h * b.rakeF, h);
    shape.lineTo(-c / 2 + h * b.rakeR, h);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 });
    g.translate(0, 0, -d / 2);
    return { glass: g, roof: c - h * (b.rakeF + b.rakeR) - 0.05 };
  }, [b]);
  const roofMid = (b.cabH * (b.rakeR - b.rakeF)) / 2;
  return (
    <group position={[b.cabX, base, 0]}>
      <mesh geometry={glass} castShadow>
        <meshPhysicalMaterial color="#07090c" roughness={0.06} metalness={0.4} clearcoat={1} envMapIntensity={1.6} />
      </mesh>
      <RoundedBox args={[roof + 0.12, 0.08, b.w + 0.02]} radius={0.035} position={[roofMid, b.cabH + 0.02, 0]} castShadow>
        <meshPhysicalMaterial color={roofColor} metalness={0.5} roughness={0.3} clearcoat={0.8} />
      </RoundedBox>
    </group>
  );
}

function Lamps({ b, lights, front, y }) {
  const zs = [-(b.w / 2 - 0.3), b.w / 2 - 0.3];
  if (b.lamp === "round")
    return zs.map((z) => (
      <group key={z} position={[front + 0.01, y + 0.1, z]} rotation={[0, 0, Math.PI / 2]}>
        <mesh><cylinderGeometry args={[0.13, 0.13, 0.05, 32]} /><Glow on={lights} base={0.7} hi={4} color="#e8f0ff" /></mesh>
        <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0.6]}><torusGeometry args={[0.165, 0.014, 8, 40, Math.PI * 1.45]} /><Glow on={lights} base={2.2} hi={6} /></mesh>
      </group>
    ));
  if (b.lamp === "projector")
    return zs.map((z) => (
      <group key={z} position={[front + 0.01, y, z]}>
        <mesh position={[0, 0.16, 0]}><boxGeometry args={[0.02, 0.06, 0.34]} /><Glow on={lights} base={2.2} hi={6} /></mesh>
        <mesh position={[0, -0.02, z > 0 ? 0.12 : -0.12]}><boxGeometry args={[0.02, 0.26, 0.04]} /><Glow on={lights} base={2.2} hi={6} /></mesh>
        <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.03, 0.1, 0.18]} /><Glow on={lights} base={0.5} hi={4} color="#e8f0ff" /></mesh>
      </group>
    ));
  if (b.lamp === "slim")
    return zs.map((z) => (
      <group key={z} position={[front + 0.01, y + 0.2, z]}>
        <mesh><boxGeometry args={[0.02, 0.04, 0.42]} /><Glow on={lights} base={2.4} hi={6} /></mesh>
        <mesh position={[0, -0.14, z > 0 ? 0.19 : -0.19]} rotation={[0.5 * Math.sign(z), 0, 0]}><boxGeometry args={[0.02, 0.26, 0.035]} /><Glow on={lights} base={2.4} hi={6} /></mesh>
      </group>
    ));
  return (
    <group position={[front + 0.01, y + 0.22, 0]}>
      <mesh><boxGeometry args={[0.02, 0.03, b.w - 0.25]} /><Glow on={lights} base={2.6} hi={7} /></mesh>
      {zs.map((z) => <mesh key={z} position={[0, -0.12, z]}><boxGeometry args={[0.02, 0.22, 0.03]} /><Glow on={lights} base={2.6} hi={7} /></mesh>)}
    </group>
  );
}

function Grille({ b, front, y, paint }) {
  if (b.grille === "slots")
    return (
      <group position={[front + 0.005, y, 0]}>
        <mesh><boxGeometry args={[0.02, 0.4, 0.86]} /><Trim color="#0a0a0b" /></mesh>
        {[-3, -2, -1, 0, 1, 2, 3].map((i) => <mesh key={i} position={[0.015, 0, i * 0.115]}><boxGeometry args={[0.03, 0.36, 0.05]} /><meshStandardMaterial color="#2a2b2e" metalness={0.6} roughness={0.35} /></mesh>)}
      </group>
    );
  if (b.grille === "chrome")
    return (
      <group position={[front + 0.005, y, 0]}>
        <mesh><boxGeometry args={[0.02, 0.42, 1.0]} /><Trim color="#0a0a0b" /></mesh>
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0.015, 0, i * 0.1]}><boxGeometry args={[0.03, 0.38, 0.025]} /><meshStandardMaterial color="#d6d8dc" metalness={1} roughness={0.15} /></mesh>)}
      </group>
    );
  if (b.grille === "wide")
    return <mesh position={[front + 0.005, y - 0.05, 0]}><boxGeometry args={[0.02, 0.3, b.w - 0.45]} /><meshStandardMaterial color="#0b0b0c" metalness={0.4} roughness={0.5} /></mesh>;
  return (
    <group position={[front + 0.005, y, 0]}>
      <mesh><boxGeometry args={[0.02, 0.3, b.w - 0.5]} /><Paint color={paint} /></mesh>
      <mesh position={[0.015, 0, 0]}><boxGeometry args={[0.01, 0.06, 0.18]} /><Glow on base={1.5} hi={1.5} /></mesh>
    </group>
  );
}

function RoofRack({ x, y, len, w }) {
  const steel = <meshStandardMaterial color="#1c1d20" metalness={0.7} roughness={0.4} />;
  return (
    <group position={[x, y + 0.07, 0]}>
      {[-(w / 2 - 0.1), w / 2 - 0.1].map((z) => <mesh key={z} position={[0, 0, z]} castShadow><boxGeometry args={[len, 0.05, 0.05]} />{steel}</mesh>)}
      {[-0.42, -0.14, 0.14, 0.42].map((f) => <mesh key={f} position={[f * len, 0, 0]} castShadow><boxGeometry args={[0.04, 0.04, w - 0.2]} />{steel}</mesh>)}
      <RoundedBox args={[len * 0.42, 0.18, w * 0.62]} radius={0.06} position={[-len * 0.15, 0.12, 0]} castShadow><meshStandardMaterial color="#2a2b2e" roughness={0.9} /></RoundedBox>
    </group>
  );
}
function RoofBox({ x, y, len, w }) {
  return (
    <group position={[x, y + 0.08, 0]}>
      {[-(w / 2 - 0.15), w / 2 - 0.15].map((z) => <mesh key={z} position={[0, 0, z]}><boxGeometry args={[len * 0.8, 0.04, 0.04]} /><meshStandardMaterial color="#1c1d20" metalness={0.7} roughness={0.4} /></mesh>)}
      <RoundedBox args={[len * 0.72, 0.26, w * 0.55]} radius={0.12} smoothness={6} position={[-0.05, 0.16, 0]} castShadow>
        <meshPhysicalMaterial color="#111214" metalness={0.3} roughness={0.25} clearcoat={1} />
      </RoundedBox>
    </group>
  );
}

export default function Vehicle({ model = "thar", paint = PAINTS[0].hex, rim = RIMS[0].hex, acc = {}, lights = false, spin = 0, roof = "black" }) {
  const b = BODIES[model] || BODIES.thar;
  const top = b.bodyY + b.bodyH / 2;
  const front = b.len / 2;
  const roofTop = top + b.cabH + 0.06;
  const roofLen = b.cabLen - b.cabH * (b.rakeF + b.rakeR);
  const roofX = b.cabX + (b.cabH * (b.rakeR - b.rakeF)) / 2;
  const roofColor = roof === "body" ? paint : "#0f1012";
  return (
    <group>
      <mesh position={[0, b.bodyY - b.bodyH / 2 - 0.05, 0]} castShadow><boxGeometry args={[b.len - 0.25, 0.22, b.w - 0.3]} /><Trim color="#0d0d0e" /></mesh>
      <RoundedBox args={[b.len, b.bodyH, b.w]} radius={0.1} smoothness={5} position={[0, b.bodyY, 0]} castShadow receiveShadow><Paint color={paint} /></RoundedBox>
      <RoundedBox args={[b.hoodLen, 0.12, b.w - 0.08]} radius={0.05} smoothness={4} position={[front - b.hoodLen / 2 - 0.02, top + 0.02, 0]} castShadow><Paint color={paint} /></RoundedBox>
      <Cabin b={b} base={top} roofColor={roofColor} />
      <Grille b={b} front={front} y={b.bodyY + 0.02} paint={paint} />
      <Lamps b={b} lights={lights} front={front} y={b.bodyY} />
      {lights && <pointLight position={[front + 1.6, b.bodyY, 0]} intensity={24} distance={9} decay={1.6} color="#eaf1ff" />}
      {!acc.bumper && <RoundedBox args={[0.28, 0.24, b.w + 0.04]} radius={0.06} position={[front + 0.06, b.bodyY - b.bodyH / 2 + 0.06, 0]} castShadow><Trim /></RoundedBox>}
      <RoundedBox args={[0.26, 0.22, b.w + 0.04]} radius={0.06} position={[-front - 0.05, b.bodyY - b.bodyH / 2 + 0.06, 0]} castShadow><Trim /></RoundedBox>
      {b.lamp === "ev" || b.lamp === "slim" ? (
        <mesh position={[-front - 0.005, b.bodyY + 0.18, 0]}><boxGeometry args={[0.02, 0.04, b.w - 0.2]} /><Glow on={lights} base={1.8} hi={5} color="#ff1a1a" /></mesh>
      ) : (
        [-(b.w / 2 - 0.12), b.w / 2 - 0.12].map((z) => <mesh key={z} position={[-front - 0.005, b.bodyY + 0.1, z]}><boxGeometry args={[0.02, 0.26, 0.1]} /><Glow on={lights} base={1.6} hi={5} color="#ff1a1a" /></mesh>)
      )}
      {b.wheelX.map((x) => [-1, 1].map((s) => (
        <RoundedBox key={x + "" + s} args={[1.02, b.flares ? 0.16 : 0.08, 0.16]} radius={0.04} position={[x, b.bodyY - (b.flares ? 0.08 : 0.12), s * (b.w / 2 + 0.02)]} castShadow><Trim /></RoundedBox>
      )))}
      {[0.2, -0.75].map((x) => [-1, 1].map((s) => <mesh key={x + "" + s} position={[x, b.bodyY + 0.2, s * (b.w / 2 + 0.005)]}><boxGeometry args={[0.16, 0.03, 0.02]} /><Trim color="#2a2b2e" /></mesh>))}
      {[-1, 1].map((s) => <RoundedBox key={s} args={[0.1, 0.13, 0.16]} radius={0.03} position={[b.cabX + b.cabLen / 2 - 0.15, top + 0.18, s * (b.w / 2 + 0.06)]}><Trim /></RoundedBox>)}
      {b.wheelX.map((x) => [-1, 1].map((s) => <Wheel key={x + "" + s} position={[x, 0.42 * b.tyre, s * (b.w / 2 - 0.04)]} rim={rim} spin={spin} scale={b.tyre} />))}
      {b.spare && <Wheel position={[-front - 0.22, b.bodyY + 0.2, 0.05]} rotation={[0, Math.PI / 2, 0]} rim={rim} scale={0.92} />}
      {b.rails && !acc.rack && !acc.roofbox && [-(b.w / 2 - 0.08), b.w / 2 - 0.08].map((z) => (
        <mesh key={z} position={[roofX, roofTop + 0.06, z]}><boxGeometry args={[roofLen * 0.95, 0.04, 0.04]} /><meshStandardMaterial color="#b9bcc1" metalness={1} roughness={0.2} /></mesh>
      ))}

      {acc.rack && <RoofRack x={roofX} y={roofTop} len={roofLen} w={b.w} />}
      {acc.roofbox && <RoofBox x={roofX} y={roofTop} len={roofLen} w={b.w} />}
      {acc.lightbar && (
        <group position={[roofX + roofLen / 2 - 0.05, roofTop + 0.08, 0]}>
          <mesh castShadow><boxGeometry args={[0.12, 0.11, b.w - 0.35]} /><Trim /></mesh>
          <mesh position={[0.065, 0, 0]}><boxGeometry args={[0.01, 0.07, b.w - 0.42]} /><Glow on={lights} base={0.3} hi={7} color="#fff6e0" /></mesh>
        </group>
      )}
      {acc.bumper && (
        <group position={[front + 0.12, b.bodyY - b.bodyH / 2 + 0.08, 0]}>
          <RoundedBox args={[0.42, 0.38, b.w + 0.18]} radius={0.04} castShadow><meshStandardMaterial color="#26272a" metalness={0.6} roughness={0.45} /></RoundedBox>
          <mesh position={[0.2, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.55, 24]} /><meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} /></mesh>
          {[-0.68, 0.68].map((z) => <mesh key={z} position={[0.24, -0.1, z]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.06, 0.022, 10, 24]} /><meshStandardMaterial color="#d11a22" roughness={0.4} /></mesh>)}
        </group>
      )}
      {acc.snorkel && (
        <group position={[b.cabX + b.cabLen / 2 + 0.05, 0, b.w / 2 + 0.06]}>
          <mesh position={[0, top + 0.25, 0]}><cylinderGeometry args={[0.055, 0.055, 1.2, 16]} /><Trim color="#18181a" rough={0.6} /></mesh>
          <RoundedBox args={[0.22, 0.14, 0.14]} radius={0.03} position={[0.05, top + 0.9, 0]}><Trim color="#18181a" rough={0.6} /></RoundedBox>
        </group>
      )}
      {acc.ladder && (
        <group position={[-front - 0.08, top + 0.25, -(b.w / 2 - 0.25)]}>
          {[-0.17, 0.17].map((z) => <mesh key={z} position={[0, 0, z]}><boxGeometry args={[0.04, 1.1, 0.04]} /><meshStandardMaterial color="#1c1d20" metalness={0.7} roughness={0.4} /></mesh>)}
          {[-0.4, -0.15, 0.1, 0.35].map((y) => <mesh key={y} position={[0, y, 0]}><boxGeometry args={[0.04, 0.035, 0.34]} /><meshStandardMaterial color="#1c1d20" metalness={0.7} roughness={0.4} /></mesh>)}
        </group>
      )}
      {acc.steps && [-1, 1].map((s) => (
        <mesh key={s} position={[(b.wheelX[0] + b.wheelX[1]) / 2, 0.5, s * (b.w / 2 + 0.06)]} castShadow><boxGeometry args={[Math.abs(b.wheelX[0] - b.wheelX[1]) - 0.75, 0.05, 0.16]} /><meshStandardMaterial color="#2a2b2e" metalness={0.8} roughness={0.3} /></mesh>
      ))}
    </group>
  );
}
