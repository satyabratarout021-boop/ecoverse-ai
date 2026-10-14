import React from 'react';

export const CityQuarter = ({ onSelectObject }) => {
  const buildings = [
    {
      id: 'city-tower-alpha',
      name: 'Cyber City Commercial Tower A',
      type: 'Commercial High-Rise',
      pos: [5, 2.5, 4],
      size: [2.2, 5, 2.2],
      color: '#334155',
      windowColor: '#38bdf8',
      info: '18-story smart building with IoT climate control and rooftop solar glass.',
    },
    {
      id: 'city-tower-beta',
      name: 'Eco-Residences Tower 1',
      type: 'Residential Green Building',
      pos: [8, 3, 5],
      size: [2, 6, 2],
      color: '#1e293b',
      windowColor: '#34d399',
      info: '48 smart apartments equipped with greywater recycling and smart energy meters.',
    },
    {
      id: 'city-tech-hub',
      name: 'Municipal Innovation Tech Hub',
      type: 'Civic Innovation Center',
      pos: [6, 1.8, 1],
      size: [3, 3.6, 2],
      color: '#0f172a',
      windowColor: '#60a5fa',
      info: 'Command center for civic AI monitoring and municipal telemetry data streams.',
    },
    {
      id: 'city-tower-gamma',
      name: 'Eco-Residences Tower 2',
      type: 'Residential Green Building',
      pos: [8, 2.2, 1],
      size: [1.8, 4.4, 1.8],
      color: '#1e293b',
      windowColor: '#fbbf24',
      info: 'LEED Platinum certified sustainable residential tower with EV charging bays.',
    },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* City Asphalt Base Plaza */}
      <mesh position={[6.5, 0.02, 3]} receiveShadow>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Modern Buildings */}
      {buildings.map((b) => (
        <group
          key={b.id}
          position={b.pos}
          onClick={(e) => {
            e.stopPropagation();
            onSelectObject({
              name: b.name,
              category: b.type,
              department: 'General / Smart City',
              details: b.info,
              status: 'Optimal (IoT Connected)',
              coordinates: { x: b.pos[0], y: b.pos[1], z: b.pos[2] },
            });
          }}
        >
          {/* Main Tower Box */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial color={b.color} roughness={0.4} metalness={0.2} />
          </mesh>

          {/* Glowing Windows Band Accent */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[b.size[0] + 0.02, b.size[1] * 0.7, b.size[2] + 0.02]} />
            <meshStandardMaterial
              color={b.windowColor}
              emissive={b.windowColor}
              emissiveIntensity={0.25}
              wireframe
            />
          </mesh>

          {/* Rooftop Solar Pergola */}
          <mesh position={[0, b.size[1] / 2 + 0.2, 0]}>
            <boxGeometry args={[b.size[0] * 0.8, 0.1, b.size[2] * 0.8]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
