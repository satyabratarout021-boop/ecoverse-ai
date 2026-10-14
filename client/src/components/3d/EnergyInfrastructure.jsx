import React from 'react';

export const EnergyInfrastructure = ({ onSelectObject }) => {
  const solarPanels = [
    [-1.2, -1],
    [0, -1],
    [1.2, -1],
    [-1.2, 0.4],
    [0, 0.4],
    [1.2, 0.4],
  ];

  return (
    <group position={[3.5, 0, -7.5]}>
      {/* Solar Farm Gravel Footprint */}
      <mesh position={[0, 0.01, -0.3]} receiveShadow>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Solar Panel Array */}
      {solarPanels.map(([x, z], i) => (
        <group
          key={i}
          position={[x, 0.4, z]}
          rotation={[-Math.PI / 6, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectObject({
              name: `Photovoltaic String Array #${i + 1}`,
              category: 'Clean Solar Energy',
              department: 'Electricity / EnergyGuard',
              details: 'Bifacial monocrystalline solar modules feeding 420.8 kW peak to the microgrid.',
              status: i === 5 ? 'Warning (Inverter C-3 derating)' : 'Optimal (Active)',
              coordinates: { x: 3.5 + x, y: 0.4, z: -7.5 + z },
            });
          }}
        >
          {/* Panel Base Stand */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.4, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>

          {/* Silicon Solar Panel Glass Surface */}
          <mesh castShadow>
            <boxGeometry args={[1, 0.04, 0.7]} />
            <meshStandardMaterial
              color="#0369a1"
              emissive="#0284c7"
              emissiveIntensity={0.2}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* Grid Substation & Battery Storage Unit */}
      <mesh
        position={[2.2, 0.6, -0.3]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject({
            name: 'EcoVerse Smart Grid Battery & Inverter Hub',
            category: 'Energy Storage System (BESS)',
            department: 'Electricity / EnergyGuard',
            details: '1.2 MWh Lithium-Iron-Phosphate battery bank. State of Charge: 86.4%. Current load: 210 kW.',
            status: 'Optimal (Synchronized with 50.02 Hz grid)',
            coordinates: { x: 5.7, y: 0.6, z: -7.8 },
          });
        }}
      >
        <boxGeometry args={[1.2, 1.2, 1.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
};
