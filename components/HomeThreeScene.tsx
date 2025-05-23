import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Inline GLSL shaders (fix: use backticks and correct syntax)
const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vDistort;
  void main() {
    vUv = uv;
    float t = uTime * 0.7;
    float noise = 0.15 * sin(uv.y * 10.0 + t) * cos(uv.x * 10.0 - t);
    vDistort = noise;
    vec3 newPosition = position + normal * noise;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;
const fragmentShader = `
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vDistort;
  void main() {
    float edge = smoothstep(0.0, 0.15, abs(vDistort));
    vec3 color = mix(uColor, vec3(0.9,0.2,0.2), edge * 0.5);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const BlobMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#fbbf24'),
  },
  vertexShader,
  fragmentShader
);
extend({ BlobMaterial });

function AnimatedBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  useFrame(({ clock }) => {
    if (meshRef.current && materialRef.current) {
      (meshRef.current as THREE.Mesh).rotation.y = clock.getElapsedTime() * 0.5;
      (meshRef.current as THREE.Mesh).rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
      materialRef.current.uTime = clock.getElapsedTime();
    }
  });
  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <sphereGeometry args={[1.2, 128, 128]} />
      {/* @ts-ignore */}
      <blobMaterial ref={materialRef} uColor={new THREE.Color('#fbbf24')} />
    </mesh>
  );
}

function FloatingParticles() {
  const count = 120;
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
    }
    return new Float32Array(arr);
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#fff" size={0.06} sizeAttenuation opacity={0.18} transparent />
    </points>
  );
}

export default function HomeThreeScene() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <AnimatedBlob />
        <FloatingParticles />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>
      {/* Vignette overlay for dark edges */}
      <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)',
      }} />
    </div>
  );
}
