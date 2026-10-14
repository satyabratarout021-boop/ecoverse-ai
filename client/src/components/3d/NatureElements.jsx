import React from 'react';

export const NatureElements = () => {
  const trees = [
    [-2, 2],
    [-3, 4],
    [-2, 6],
    [-1, 8],
    [2, 7],
    [4, 8],
    [-8, 6],
    [-8, 4],
    [-5, -7],
    [-2, -7],
    [2, -3],
    [3, -4],
    [7, -1],
    [8, -2],
    [-1, -2],
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* Ground Base Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial color="#064e3b" roughness={0.9} />
      </mesh>

      {/* Trees */}
      {trees.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Trunk */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.8, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {/* Foliage (Cone or Sphere) */}
          {i % 2 === 0 ? (
            <mesh position={[0, 1.1, 0]} castShadow>
              <coneGeometry args={[0.55, 1.2, 7]} />
              <meshStandardMaterial color="#15803d" roughness={0.6} />
            </mesh>
          ) : (
            <mesh position={[0, 1, 0]} castShadow>
              <sphereGeometry args={[0.5, 7, 7]} />
              <meshStandardMaterial color="#16a34a" roughness={0.6} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};
