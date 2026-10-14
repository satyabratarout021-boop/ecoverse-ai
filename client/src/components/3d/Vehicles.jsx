import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const Vehicles = () => {
  const car1Ref = useRef();
  const car2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Car 1 travels along East-West Highway
    if (car1Ref.current) {
      const x = ((t * 2.5) % 24) - 12;
      car1Ref.current.position.x = x;
      car1Ref.current.position.z = 0.4;
    }

    // Car 2 travels along North-South Avenue
    if (car2Ref.current) {
      const z = ((-t * 2.2) % 24) + 12;
      car2Ref.current.position.z = z;
      car2Ref.current.position.x = -0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* EV Car 1 (Cyan Smart Shuttle) */}
      <group ref={car1Ref} position={[0, 0.15, 0.4]}>
        {/* Body */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.28, 0.45]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Cabin */}
        <mesh position={[-0.05, 0.22, 0]}>
          <boxGeometry args={[0.45, 0.2, 0.4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.42, 0.05, 0.12]}>
          <boxGeometry args={[0.04, 0.08, 0.08]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.42, 0.05, -0.12]}>
          <boxGeometry args={[0.04, 0.08, 0.08]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* EV Car 2 (Emerald Municipal Transit Van) */}
      <group ref={car2Ref} position={[-0.4, 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Van Body */}
        <mesh castShadow>
          <boxGeometry args={[1.1, 0.42, 0.5]} />
          <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.57, 0.05, 0.14]}>
          <boxGeometry args={[0.04, 0.08, 0.08]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.57, 0.05, -0.14]}>
          <boxGeometry args={[0.04, 0.08, 0.08]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      </group>
    </group>
  );
};
