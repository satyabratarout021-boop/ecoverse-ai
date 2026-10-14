import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const VillageQuarter = ({ onSelectObject }) => {
  const windmillRef = useRef();

  // Rotate windmill blades
  useFrame((state, delta) => {
    if (windmillRef.current) {
      windmillRef.current.rotation.z += delta * 1.5;
    }
  });

  const houses = [
    {
      id: 'village-house-1',
      name: 'North Farmer Homestead',
      pos: [-6, 0.7, -2],
      wallColor: '#fef3c7',
      roofColor: '#b45309',
      info: 'Traditional adobe-style farmhouse with rainwater collection barrel.',
    },
    {
      id: 'village-house-2',
      name: 'Panchayat Community Center',
      pos: [-4, 0.8, -4],
      wallColor: '#e0e7ff',
      roofColor: '#b91c1c',
      info: 'Village governing hall and telemedicine outpost with public Wi-Fi hotspot.',
    },
    {
      id: 'village-house-3',
      name: 'Village Artisan Workshop',
      pos: [-7, 0.6, -5],
      wallColor: '#ffedd5',
      roofColor: '#c2410c',
      info: 'Local handicrafts and solar-powered loom cooperative.',
    },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Village Earth / Grass Terrain */}
      <mesh position={[-5.5, 0.01, -3.5]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#14532d" roughness={0.9} />
      </mesh>

      {/* Village Houses */}
      {houses.map((h) => (
        <group
          key={h.id}
          position={h.pos}
          onClick={(e) => {
            e.stopPropagation();
            onSelectObject({
              name: h.name,
              category: 'Smart Village Infrastructure',
              department: 'General / Rural Dev',
              details: h.info,
              status: 'Optimal',
              coordinates: { x: h.pos[0], y: h.pos[1], z: h.pos[2] },
            });
          }}
        >
          {/* House Base Walls */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 1.2, 1.4]} />
            <meshStandardMaterial color={h.wallColor} roughness={0.7} />
          </mesh>

          {/* Pitched Roof (Prism) */}
          <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.3, 0.8, 4]} />
            <meshStandardMaterial color={h.roofColor} roughness={0.5} />
          </mesh>

          {/* Wooden Door */}
          <mesh position={[0, -0.2, 0.71]}>
            <boxGeometry args={[0.4, 0.7, 0.05]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        </group>
      ))}

      {/* Village Windmill */}
      <group
        position={[-7.5, 0, 2]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject({
            name: 'EcoVerse Community Windmill',
            category: 'Renewable Energy / Wind',
            department: 'Electricity / EnergyGuard',
            details: 'Micro wind turbine generating 15 kW for village water irrigation pump.',
            status: 'Operational (Generating 11.2 kW)',
            coordinates: { x: -7.5, y: 1.5, z: 2 },
          });
        }}
      >
        {/* Tower Base */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.45, 3.6, 12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>

        {/* Nacelle */}
        <mesh position={[0, 3.6, 0.1]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.7]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>

        {/* Rotor Hub & Blades */}
        <group position={[0, 3.6, 0.45]} ref={windmillRef}>
          <mesh>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          {/* Blade 1 */}
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.12, 1.8, 0.02]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Blade 2 */}
          <mesh position={[0.78, -0.45, 0]} rotation={[0, 0, (2 * Math.PI) / 3]}>
            <boxGeometry args={[0.12, 1.8, 0.02]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Blade 3 */}
          <mesh position={[-0.78, -0.45, 0]} rotation={[0, 0, (4 * Math.PI) / 3]}>
            <boxGeometry args={[0.12, 1.8, 0.02]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
