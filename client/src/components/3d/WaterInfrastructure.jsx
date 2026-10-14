import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const WaterInfrastructure = ({ onSelectObject }) => {
  const waterRef = useRef();

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = 1.45 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
    }
  });

  return (
    <group position={[-6.5, 0, 6.2]}>
      {/* Reservoir Concrete Tank */}
      <mesh
        position={[0, 0.8, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject({
            name: 'North Village Main Water Reservoir',
            category: 'Municipal Water Storage',
            department: 'Water / JalRakshak',
            details: '12.5M Litre elevated storage tank feeding 4,200 households. Ultrasonic sensor level: 78.4%.',
            status: 'Monitoring (Minor Leakage Alert nearby)',
            coordinates: { x: -6.5, y: 1.6, z: 6.2 },
          });
        }}
      >
        <cylinderGeometry args={[1.8, 1.9, 1.6, 24]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} />
      </mesh>

      {/* Water Surface inside Tank */}
      <mesh position={[0, 1.45, 0]} ref={waterRef}>
        <cylinderGeometry args={[1.7, 1.7, 0.1, 24]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Pump Station Control Cabin */}
      <mesh
        position={[2.2, 0.6, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject({
            name: 'Pumping Station Alpha (Booster Station)',
            category: 'Water Pressure Grid',
            department: 'Water / JalRakshak',
            details: 'Variable frequency drive centrifugal pumps operating at 3.8 bar line pressure.',
            status: 'Active (340 L/s outflow)',
            coordinates: { x: -4.3, y: 0.6, z: 6.2 },
          });
        }}
      >
        <boxGeometry args={[1.4, 1.2, 1.4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Distribution Pipeline */}
      <mesh position={[1.1, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 1.8, 12]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};
