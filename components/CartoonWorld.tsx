import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Animated stars component
function AnimatedStars() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });
  // Generate 200 stars at random positions
  const stars = Array.from({ length: 200 }, () => {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const r = 55 + Math.random() * 5;
    return {
      pos: [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ] as [number, number, number],
      size: Math.random() * 0.25 + 0.05
    };
  });
  return (
    <group ref={group}>
      {stars.map((star, i) => (
        <mesh key={i} position={star.pos}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1.5} />
        </mesh>
      ))}
    </group>
  );
}

// Animated planet component
function AnimatedPlanet({ position, color, size, orbitSpeed = 0.01, ring = false }: { position: [number, number, number], color: string, size: number, orbitSpeed?: number, ring?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = position[0] * Math.cos(clock.getElapsedTime() * orbitSpeed) - position[2] * Math.sin(clock.getElapsedTime() * orbitSpeed);
      ref.current.position.z = position[2] * Math.cos(clock.getElapsedTime() * orbitSpeed) + position[0] * Math.sin(clock.getElapsedTime() * orbitSpeed);
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </mesh>
      {ring && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 1.2, size * 0.15, 2, 64]} />
          <meshStandardMaterial color="#e0e0e0" opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
}

// Simple cartoon building component (label as HTML overlay)
function Building({ position, color, label, onClick }: { position: [number, number, number], color: string, label: string, onClick: () => void }) {
  return (
    <group position={position} onClick={onClick}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[1.1, 0.3, 1.1]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Label as floating HTML overlay */}
      <Html position={[0, 1.7, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          fontFamily: 'Luckiest Guy, Fredoka One, cursive',
          fontSize: '1.3rem',
          color: '#222',
          background: '#fde047',
          borderRadius: 8,
          padding: '0.2em 0.7em',
          border: '2px solid #fff',
          outline: '2px solid #222',
          boxShadow: '0 2px 8px #0003',
          userSelect: 'none',
        }}>{label}</div>
      </Html>
    </group>
  );
}

function SpaceSkybox() {
  const texture = useLoader(THREE.TextureLoader, '/textures/8k_stars_milky_way.jpg');
  return (
    <mesh>
      <sphereGeometry args={[100, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function OrbitingPlanet({ center, radius, speed, textureName, size = 2, ring = false, phase = 0, inclination = 0 }: { center: [number, number, number], radius: number, speed: number, textureName: string, size?: number, ring?: boolean, phase?: number, inclination?: number }) {
  const ref = useRef<THREE.Group>(null);
  const colorMap = useLoader(THREE.TextureLoader, `/textures/${textureName}`);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + phase;
      // Calculate orbit position with inclination (tilt)
      const x = center[0] + radius * Math.cos(t);
      const z = center[2] + radius * Math.sin(t);
      const y = center[1] + Math.sin(t + phase) * Math.sin(inclination) * radius * 0.3;
      ref.current.position.set(x, y, z);
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={colorMap} roughness={0.5} metalness={0.3} />
      </mesh>
      {ring && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 1.2, size * 0.15, 2, 64]} />
          <meshStandardMaterial color="#e0e0e0" opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
}

// Nebula video billboard component
function NebulaVideoBillboard({ videoSrc, position = [0, 20, -40], size = [32, 18], opacity = 0.3 }: { videoSrc: string, position?: [number, number, number], size?: [number, number], opacity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [video] = React.useState(() => {
    const vid = document.createElement('video');
    vid.src = videoSrc;
    vid.crossOrigin = 'anonymous';
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.autoplay = true;
    vid.style.display = 'none';
    vid.load();
    return vid;
  });
  const [videoTexture] = React.useState(() => new THREE.VideoTexture(video));
  useEffect(() => {
    video.play();
  }, [video]);
  const skyboxTexture = useLoader(THREE.TextureLoader, '/textures/8k_stars_milky_way.jpg');
  // Oval mask and white shadow in shader
  const shaderArgs = {
    uniforms: {
      map: { value: videoTexture },
      opacity: { value: opacity },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      varying vec2 vUv;
      void main() {
        vec2 center = vec2(0.5, 0.5);
        float rx = 0.5, ry = 0.5; // oval radii
        float oval = smoothstep(0.5, 0.48, length((vUv - center) / vec2(rx, ry * 0.7)));
        float feather = smoothstep(0.45, 0.5, length((vUv - center) / vec2(rx, ry * 0.7)));
        vec4 tex = texture2D(map, vUv);
        float a = tex.a * opacity * oval;
        // White shadow effect
        float shadow = 1.0 - smoothstep(0.48, 0.5, length((vUv - center) / vec2(rx * 1.08, ry * 0.75)));
        vec3 shadowColor = mix(tex.rgb, vec3(1.0), shadow * 0.45 * feather);
        gl_FragColor = vec4(shadowColor, a);
        if (gl_FragColor.a < 0.01) discard;
      }
    `,
    transparent: true,
    depthWrite: false,
  };
  return (
    <group position={position}>
      {/* Skybox-matching background box */}
      <mesh>
        <boxGeometry args={[size[0], size[1], 0.1]} />
        <meshBasicMaterial map={skyboxTexture} side={THREE.BackSide} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      {/* Oval nebula video billboard with feathered edges and white shadow */}
      <mesh ref={meshRef} position={[0, 0, 0.06]}>
        <planeGeometry args={size} />
        {/* @ts-ignore */}
        <shaderMaterial attach="material" args={[shaderArgs]} />
      </mesh>
    </group>
  );
}

function CartoonWorld() {
  const handleNav = (target: string) => {
    window.location.href = target;
  };
  return (
    <Canvas camera={{ position: [0, 3, 8], fov: 50 }} shadows style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      {/* Realistic space skybox */}
      <SpaceSkybox />
      {/* Nebula video billboards - now smaller and positioned to look like distant solar systems within the skybox */}
      <NebulaVideoBillboard videoSrc="/textures/Nebula-videos/1 Star Shower.mp4" position={[40, 60, -70]} size={[10, 14.5]} opacity={0.95} />
      <NebulaVideoBillboard videoSrc="/textures/Nebula-videos/2 Flow Nebula.mp4" position={[-60, 40, -60]} size={[12, 14]} opacity={0.92} />
      <NebulaVideoBillboard videoSrc="/textures/Nebula-videos/12 Green Nebula.mp4" position={[70, 35, -50]} size={[16, 13.5]} opacity={0.90} />
      <NebulaVideoBillboard videoSrc="/textures/Nebula-videos/14 Fractal Atmosphere.mp4" position={[-50, -40, 60]} size={[17, 14]} opacity={0.98} />
      <NebulaVideoBillboard videoSrc="/textures/Nebula-videos/18 Fantasy Planet.mp4" position={[60, -50, 70]} size={[16, 31.5]} opacity={0.96} />
      {/* Orbiting planets using all available planet images, with centers and radii so that the entire orbit stays inside the skybox sphere (radius 100) */}
      <OrbitingPlanet center={[30, 10, -40]} radius={8} speed={0.13} textureName="8k_earth_nightmap.jpg" size={2.2} ring phase={0} inclination={0.12} />
      <OrbitingPlanet center={[-45, 18, 25]} radius={11} speed={0.10} textureName="8k_mars.jpg" size={1.4} phase={1.2} inclination={0.28} />
      <OrbitingPlanet center={[50, -22, 18]} radius={14} speed={0.09} textureName="8k_saturn.jpg" size={2.1} ring phase={2.1} inclination={0.41} />
      <OrbitingPlanet center={[-38, -30, -35]} radius={17} speed={0.11} textureName="8k_venus_surface.jpg" size={1.6} phase={2.8} inclination={0.19} />
      <OrbitingPlanet center={[32, 35, 40]} radius={20} speed={0.08} textureName="8k_moon.jpg" size={1.1} phase={3.5} inclination={0.33} />
      <OrbitingPlanet center={[-55, 40, -20]} radius={18} speed={0.07} textureName="4k_ceres_fictional.jpg" size={1.0} phase={4.2} inclination={0.52} />
      <OrbitingPlanet center={[60, -38, 30]} radius={15} speed={0.06} textureName="4k_eris_fictional.jpg" size={1.2} phase={4.9} inclination={0.16} />
      <OrbitingPlanet center={[-65, 45, 38]} radius={12} speed={0.05} textureName="4k_makemake_fictional.jpg" size={1.0} phase={5.6} inclination={0.62} />
      <OrbitingPlanet center={[70, -50, -45]} radius={10} speed={0.09} textureName="4k_venus_atmosphere.jpg" size={1.5} phase={6.3} inclination={0.23} />
      <OrbitingPlanet center={[-75, 55, 50]} radius={8} speed={0.04} textureName="8k_earth_clouds.jpg" size={2.0} phase={7.0} inclination={0.37} />
      <OrbitingPlanet center={[50, -60, 55]} radius={7} speed={0.03} textureName="8k_sun.jpg" size={3.2} phase={7.7} inclination={0.57} />
      <OrbitingPlanet center={[-85, 65, -60]} radius={6} speed={0.02} textureName="8k_stars.jpg" size={1.3} phase={8.4} inclination={0.29} />
      <OrbitingPlanet center={[70, -70, 65]} radius={5} speed={0.015} textureName="8k_earth_nightmap.jpg" size={2.0} phase={9.1} inclination={0.45} />
      <OrbitingPlanet center={[-30, 75, 70]} radius={4} speed={0.012} textureName="8k_mars.jpg" size={1.2} phase={9.8} inclination={0.32} />
      <OrbitingPlanet center={[50, 10, -35]} radius={3} speed={0.011} textureName="8k_saturn.jpg" size={1.8} ring phase={10.5} inclination={0.51} />
      <OrbitingPlanet center={[-10, 85, 80]} radius={2} speed={0.01} textureName="8k_venus_surface.jpg" size={1.7} phase={11.2} inclination={0.21} />
      {/* Asteroids (unchanged) */}
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        return (
          <mesh key={i} position={[18 * Math.cos(angle), 0.5 * Math.sin(i), 18 * Math.sin(angle)]}>
            <sphereGeometry args={[0.18 + Math.random() * 0.12, 6, 6]} />
            <meshStandardMaterial color="#888" roughness={1} />
          </mesh>
        );
      })}
      {/* Ground */}
      <mesh receiveShadow position={[0, -1.01, 0]}>
        <boxGeometry args={[20, 2, 20]} />
        <meshStandardMaterial color="#22223b" />
      </mesh>
      {/* Buildings */}
      <Building position={[-3, 0, 0]} color="#fbbf24" label="About" onClick={() => window.location.href = '/about'} />
      <Building position={[0, 0, 0]} color="#f87171" label="Projects" onClick={() => window.location.href = '/projects'} />
      <Building position={[3, 0, 0]} color="#60a5fa" label="Contact" onClick={() => window.location.href = '/contact'} />
      <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}

export default CartoonWorld;
