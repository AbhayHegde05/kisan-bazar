import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const produce = [
  { type: "tomato", color: "#dd4b39", position: [-2.15, 1.05, 0.3], scale: 0.5, speed: 0.8 },
  { type: "mango", color: "#f6b343", position: [1.55, 1.35, -0.25], scale: 0.55, speed: 0.7 },
  { type: "leaf", color: "#4f7942", position: [2.45, 0.75, 0.45], scale: 0.44, speed: 0.9 },
  { type: "tomato", color: "#f97316", position: [-0.35, 1.85, -0.15], scale: 0.38, speed: 1.05 },
];

function FloatingProduce({ item, index }) {
  const groupRef = useRef(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime * item.speed + index;
    groupRef.current.position.y = item.position[1] + Math.sin(t) * 0.16;
    groupRef.current.rotation.y += 0.008 + index * 0.002;
    groupRef.current.rotation.z = Math.sin(t * 0.7) * 0.12;
  });

  return (
    <group ref={groupRef} position={item.position} scale={item.scale}>
      {item.type === "leaf" ? (
        <>
          <mesh rotation={[0.2, 0, -0.7]}>
            <sphereGeometry args={[0.45, 32, 16]} />
            <meshStandardMaterial color={item.color} roughness={0.7} metalness={0.02} />
          </mesh>
          <mesh position={[0.04, 0.0, 0.47]} rotation={[0, 0, -0.7]} scale={[0.08, 0.75, 0.08]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#31572c" roughness={0.8} />
          </mesh>
        </>
      ) : (
        <>
          <mesh scale={item.type === "mango" ? [1.08, 0.82, 0.88] : [1, 0.9, 1]}>
            <sphereGeometry args={[0.55, 40, 24]} />
            <meshStandardMaterial color={item.color} roughness={0.55} metalness={0.03} />
          </mesh>
          <mesh position={[0.0, 0.5, 0]} rotation={[0.2, 0, 0.2]} scale={[0.14, 0.28, 0.14]}>
            <coneGeometry args={[0.18, 0.42, 5]} />
            <meshStandardMaterial color="#2f4728" roughness={0.75} />
          </mesh>
        </>
      )}
    </group>
  );
}

function FarmRows() {
  const rows = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        x: -3.6 + index * 0.9,
        color: index % 2 === 0 ? "#6b8e23" : "#8fbf4d",
      })),
    []
  );

  return (
    <group position={[0, -1.05, -0.6]} rotation={[-0.28, 0, 0]}>
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.5, 4.6]} />
        <meshStandardMaterial color="#d7b377" roughness={0.95} />
      </mesh>
      {rows.map((row) => (
        <mesh key={row.x} position={[row.x, 0.02, 0]} scale={[0.16, 0.1, 4.4]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={row.color} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function MarketCrates() {
  return (
    <group position={[1.05, -0.25, 0.75]} rotation={[0, -0.35, 0]}>
      {[
        [-0.55, 0, 0, "#a16207"],
        [0.15, 0, 0.05, "#8b5e34"],
        [-0.2, 0.45, -0.04, "#b45309"],
      ].map(([x, y, z, color]) => (
        <mesh key={`${x}-${y}`} position={[x, y, z]} scale={[0.75, 0.42, 0.55]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} roughness={0.72} />
        </mesh>
      ))}
      {[-0.8, -0.42, -0.04, 0.34].map((x, index) => (
        <mesh key={x} position={[x, 0.48 + index * 0.05, 0.38]} scale={[0.16, 0.16, 0.16]}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshStandardMaterial color={index % 2 ? "#eab308" : "#ef4444"} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function DeliveryArc() {
  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.1, -0.15, 0.25),
      new THREE.Vector3(-1.5, 0.95, -0.15),
      new THREE.Vector3(0.85, 0.95, 0.35),
      new THREE.Vector3(2.85, -0.1, 0.05),
    ]);
    return new THREE.TubeGeometry(curve, 64, 0.025, 8, false);
  }, []);

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[2.84, -0.1, 0.05]} rotation={[0.2, 0, -0.8]} scale={[0.24, 0.24, 0.24]}>
        <coneGeometry args={[0.32, 0.75, 3]} />
        <meshStandardMaterial color="#f97316" roughness={0.38} />
      </mesh>
    </group>
  );
}

function Scene() {
  const rootRef = useRef(null);

  useFrame(({ clock }) => {
    if (!rootRef.current) return;
    rootRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.05;
  });

  return (
    <group ref={rootRef}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[1.5, 5, 4]} intensity={1.45} castShadow />
      <pointLight position={[-3, 2.5, 2]} intensity={0.7} color="#fbbf24" />
      <FarmRows />
      <MarketCrates />
      <DeliveryArc />
      {produce.map((item, index) => (
        <FloatingProduce key={`${item.type}-${index}`} item={item} index={index} />
      ))}
    </group>
  );
}

export default function HeroScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 1.0, 7.8], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      <Scene />
    </Canvas>
  );
}
