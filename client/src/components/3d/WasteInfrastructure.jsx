import React from 'react';

export const WasteInfrastructure = ({ onSelectObject }) => {
  return (
    <group position={[-3.8, 0, -4.2]}>
      {/* Waste Sorting Shed Base */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.4, 2]} />
        <meshStandardMaterial color="#166534" roughness={0.7} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[2.7, 0.1, 2.3]} />
        <meshStandardMaterial color="#14532d" />
      </mesh>

      {/* Color-Coded Recycling Bins Cluster */}
      {/* Blue Bin (Dry / Plastic / Paper) */}
      <mesh
        position={[-1.6, 0.35, 0.8]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject({
            name: 'Blue Smart Bin (Dry Recyclables)',
            category: 'Smart Segregation Hub',
            department: 'Waste / EcoMind',
            details: 'Plastic, paper, cardboards, and tin metals. Ultrasonic fill sensor: 48%.',
            status: 'Normal',
            coordinates: { x: -5.4, y: 0.35, z: -3.4 },
          });
        }}
      >
        <boxGeometry args={[0.5, 0.7, 0.5]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Green Bin (Wet / Organic Compost) */}
      <mesh
        position={[-0.9, 0.35, 0.8]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject({
            name: 'Green Smart Bin (Organic Waste)',
            category: 'Smart Segregation Hub',
            department: 'Waste / EcoMind',
            details: 'Biodegradable wet organics routed directly to village vermicompost pits. Ultrasonic fill sensor: 92% (High Alert).',
            status: 'Hotspot Alert (Collection Dispatched)',
            coordinates: { x: -4.7, y: 0.35, z: -3.4 },
          });
        }}
      >
        <boxGeometry args={[0.5, 0.7, 0.5]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>

      {/* Yellow Bin (Glass / Fragile) */}
      <mesh
        position={[-0.2, 0.35, 0.8]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject({
            name: 'Yellow Smart Bin (Glass & Ceramics)',
            category: 'Smart Segregation Hub',
            department: 'Waste / EcoMind',
            details: 'Sorted glass bottles and cullet. Ultrasonic fill sensor: 24%.',
            status: 'Normal',
            coordinates: { x: -4.0, y: 0.35, z: -3.4 },
          });
        }}
      >
        <boxGeometry args={[0.5, 0.7, 0.5]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>

      {/* Sanitation Collection EV Truck */}
      <group position={[1.8, 0, 0.5]}>
        {/* Truck Chassis */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.5, 0.7]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        {/* Truck Cab */}
        <mesh position={[0.45, 0.6, 0]} castShadow>
          <boxGeometry args={[0.4, 0.5, 0.65]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
};
