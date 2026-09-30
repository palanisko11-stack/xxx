// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom 3D Wireframe Cube using drei primitives
const WireframeCube = ({ color = '#22d3ee', size = 2 }: { color?: string; size?: number }) => {
  return (
    <group>
      <edges geometry={new THREE.BoxGeometry(size, size, size)}>
        <lineBasicMaterial color={color} linewidth={2} />
      </edges>
    </group>
  );
};

// Scanning Plane Component
const ScanningPlane = ({ color = '#22d3ee', size = 2.5 }: { color?: string; size?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() * 0.5;
      const yPos = Math.sin(time) * size;
      meshRef.current.position.y = yPos;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size * 2, size * 0.1]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Particle System for depth points
const DepthPoints = ({ count = 500, radius = 3 }: { count?: number; radius?: number }) => {
  const particlesPosition = useRef<THREE.BufferAttribute>(null);
  
  useEffect(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.random();
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    particlesPosition.current = new THREE.BufferAttribute(positions, 3);
  }, [count, radius]);

  if (!particlesPosition.current) return null;

  return (
    <Points positions={particlesPosition.current.array as any} stride={3} frustumCulled={false}>
      <PointMaterial color="#22d3ee" size={0.02} transparent opacity={0.8} />
    </Points>
  );
};

// Animated Grid Helper
const AnimatedGrid = ({ size = 5, divisions = 10 }: { size?: number; divisions?: number }) => {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      const time = state.clock.getElapsedTime();
      const intensity = 0.5 + 0.5 * Math.sin(time * 2);
      gridRef.current.material.color.setRGB(
        0.1 * intensity,
        0.3 * intensity,
        0.4 * intensity
      );
    }
  });

  return <Grid args={[size, divisions]} ref={gridRef as any} />;
};

// Main 3D Scene Component
const Reconstruction3DScene = ({ isProcessing }: { isProcessing: boolean }) => {
  const [showCube, setShowCube] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    if (isProcessing) {
      const cubeTimer = setTimeout(() => setShowCube(true), 500);
      const pointsTimer = setTimeout(() => setShowPoints(true), 1500);
      return () => {
        clearTimeout(cubeTimer);
        clearTimeout(pointsTimer);
      };
    } else {
      setShowCube(false);
      setShowPoints(false);
    }
  }, [isProcessing]);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 1000 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} color="#22d3ee" />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#22d3ee" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#0891b2" />
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={15}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />

      <Environment preset="city" />
      
      {showGrid && <AnimatedGrid size={4} divisions={8} />}
      
      {showPoints && <DepthPoints count={300} radius={2} />}
      
      {showCube && (
        <group rotation={[0, Math.PI / 4, 0]}>
          <WireframeCube color="#22d3ee" size={1.5} />
        </group>
      )}
      
      {isProcessing && <ScanningPlane color="#22d3ee" size={2} />}
      
      {showCube && (
        <group rotation={[Math.PI / 4, 0, Math.PI / 4]} position={[0, 0, -1]}>
          <WireframeCube color="#0891b2" size={1} />
        </group>
      )}
    </Canvas>
  );
};

export default Reconstruction3DScene;
