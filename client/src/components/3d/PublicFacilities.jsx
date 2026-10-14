import React from 'react';

export const PublicFacilities = ({ onSelectObject }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Central Civic Hospital */}
      <group
        position={[6.8, 0, -5.4]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject({
            name: 'EcoVerse Central Health & Trauma Complex',
            category: 'Public Health Facility',
            department: 'General / Health',
            details: '200-bed hospital with 24/7 solar backup, oxygen plant, and automated drainage.',
            status: 'Operational',
            coordinates: { x: 6.8, y: 1.5, z: -5.4 },
          });
        }}
      >
        {/* Hospital Main Wing */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 2.8, 2.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>

        {/* Hospital Glass Annex */}
        <mesh position={[1.4, 0.9, 0]} castShadow>
          <boxGeometry args={[1.2, 1.8, 1.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.7} />
        </mesh>

        {/* Glowing Red Cross on Roof */}
        <group position={[0, 3.1, 0]}>
          <mesh>
            <boxGeometry args={[0.25, 0.8, 0.1]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.8, 0.25, 0.1]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>

      {/* Green Valley Public School */}
      <group
        position={[-7.1, 0, 1.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectObject({
            name: 'Green Valley Smart Composite School',
            category: 'Public Education Facility',
            department: 'General Civic Services',
            details: 'Solar powered smart school with digital literacy labs and vocational training center.',
            status: 'Operational',
            coordinates: { x: -7.1, y: 1.1, z: 1.5 },
          });
        }}
      >
        {/* School Building */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.2, 1.8]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.5} />
        </mesh>

        {/* Bell Tower */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <coneGeometry args={[0.6, 1, 4]} />
          <meshStandardMaterial color="#c2410c" />
        </mesh>
      </group>
    </group>
  );
};
