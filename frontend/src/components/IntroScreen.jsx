import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Very lightweight 3D intro animation (no external assets).
 * Uses a morphing gradient field + floating particles.
 */

function BlobField({ lang }) {
  const group = useRef();
  const matRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uLangHue: { value: 120 },
  }), []);

  useEffect(() => {
    const hueByLang = { en: 120, hi: 10, kn: 160, ta: 200, te: 290 };
    uniforms.uLangHue.value = hueByLang[lang] ?? 120;
  }, [lang, uniforms]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    uniforms.uTime.value = t;
    if (group.current) {
      group.current.rotation.y = t * 0.15;
      group.current.rotation.x = Math.sin(t * 0.12) * 0.15;
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <group ref={group}>
      <mesh scale={[2.2, 2.2, 2.2]}>
        <icosahedronGeometry args={[1.0, 5]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={
            `
            varying vec2 vUv;
            uniform float uTime;
            void main() {
              vUv = uv;
              vec3 p = position;
              float wave = sin(p.x*3.0 + uTime*1.2) * cos(p.y*3.0 + uTime*0.9);
              p += normalize(p) * wave * 0.08;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }
          `
          }
          fragmentShader={
            `
            varying vec2 vUv;
            uniform float uTime;
            uniform float uLangHue;
            void main() {
              // Soft animated gradient
              float a = sin((vUv.x + uTime*0.05)*6.2831) * 0.5 + 0.5;
              float b = cos((vUv.y + uTime*0.04)*6.2831) * 0.5 + 0.5;
              float c = (a+b)*0.5;
              vec3 colA = vec3(0.15, 0.7, 0.25);
              vec3 colB = vec3(0.1, 0.35, 0.9);
              // hue-ish mixing by lang
              float hue = (uLangHue/360.0);
              vec3 col = mix(colA, colB, c) * (0.85 + 0.35*hue);
              float alpha = 0.85;
              gl_FragColor = vec4(col, alpha);
            }
          `
          }
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Particles() {
  const pointsRef = useRef();

  const points = useMemo(() => {
    const count = 700;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // inside a sphere-ish volume
      const r = Math.cbrt(Math.random()) * 1.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = t * 0.08;
    pointsRef.current.rotation.x = Math.sin(t * 0.11) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={points} itemSize={3} count={points.length / 3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={new THREE.Color('#22c55e')} transparent opacity={0.9} />
    </points>
  );
}

export default function IntroScreen({ lang = 'en', onDone }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Total intro duration ~ 2.4s
    const t = setTimeout(() => onDone?.(), 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[1000] bg-gradient-to-br from-green-50 via-white to-green-100">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
      >
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 55 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[2.2, 2.5, 2.0]} intensity={1.2} />
          <BlobField lang={lang} />
          <Particles />
        </Canvas>
      </div>

      <div className="relative z-[1001] h-full flex items-center justify-center">
        <div className="text-center px-6">
          <div className="inline-flex items-center gap-3 bg-white/70 border border-green-200/70 backdrop-blur px-4 py-2 rounded-full shadow-lg">
            <span className="text-2xl">🌿</span>
            <span className="font-semibold text-green-800">KisanBazar</span>
            <span className="text-xs text-green-700/80">connecting farms → communities</span>
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow">
            Welcome
          </h1>
          <p className="mt-4 text-gray-700/80 max-w-xl mx-auto">
            Fast translations + clean UI.
          </p>

          <div className="mt-8 h-2 w-64 mx-auto rounded-full bg-green-100 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-green-400 via-green-600 to-green-400 animate-[introBar_2.4s_linear_infinite]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes introBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

