import React from 'react';

export const RoadNetwork = ({ onSelectObject }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Main East-West Highway */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <planeGeometry args={[26, 2.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Main North-South Avenue */}
      <mesh position={[0, 0.016, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[26, 2.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Village Connector Byway */}
      <mesh position={[-5, 0.014, -2]} rotation={[0, Math.PI / 4, 0]} receiveShadow>
        <planeGeometry args={[10, 1.4]} />
        <meshStandardMaterial color="#334155" roughness={0.95} />
      </mesh>

      {/* Central Intersection Roundabout */}
      <mesh position={[0, 0.018, 0]} receiveShadow>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Central Fountain Island */}
      <mesh
        position={[0, 0.25, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject({
            name: 'Central Harmony Fountain & Rotary',
            category: 'Civic Landmark',
            department: 'General Civic Services',
            details: 'Solar-powered kinetic fountain marking the convergence of Smart City & Smart Village.',
            status: 'Optimal',
            coordinates: { x: 0, y: 0.25, z: 0 },
          });
        }}
      >
        <cylinderGeometry args={[1.1, 1.2, 0.4, 24]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.5} />
      </mesh>

      {/* Smart Streetlights with glow */}
      {[
        [-8, 0],
        [-4, 0],
        [4, 0],
        [8, 0],
        [0, -8],
        [0, -4],
        [0, 4],
        [0, 8],
      ].map(([x, z], i) => (
        <group
          key={i}
          position={[x, 0, z + 1.2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectObject({
              name: `Smart Streetlight #SL-${100 + i}`,
              category: 'Smart Streetlight Grid',
              department: 'Electricity / EnergyGuard',
              details: 'Equipped with ambient light sensor, LoRaWAN mesh controller, and auto-dimming.',
              status: i === 0 ? 'Warning (Driver Maintenance Needed)' : 'Optimal (Active)',
              coordinates: { x, y: 1.6, z: z + 1.2 },
            });
          }}
        >
          {/* Pole */}
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.03, 0.05, 2.2, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          {/* Lamp Arm */}
          <mesh position={[0, 2.1, -0.2]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.05, 0.4, 0.05]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          {/* LED Fixture */}
          <mesh position={[0, 2.2, -0.35]}>
            <boxGeometry args={[0.15, 0.06, 0.25]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fef08a"
              emissiveIntensity={i === 0 ? 0.3 : 0.9}
            />
          </mesh>
          {/* Subtle Localized Point Light */}
          <pointLight
            position={[0, 2, -0.35]}
            color="#fef08a"
            intensity={i === 0 ? 0.2 : 0.6}
            distance={4}
          />
        </group>
      ))}
    </group>
  );
};
