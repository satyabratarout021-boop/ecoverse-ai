import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Droplets, Trash2, Zap, Construction, AlertCircle } from 'lucide-react';

export const ComplaintMarker3D = ({ complaint, isSelected, onClick }) => {
  const meshRef = useRef();

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        (complaint.location?.coordinates?.y ?? 0.5) +
        Math.sin(state.clock.elapsedTime * 3 + complaint._id.charCodeAt(0)) * 0.15;
    }
  });

  const getMarkerColor = () => {
    if (complaint.priority === 'emergency') return '#ef4444';
    switch (complaint.status) {
      case 'pending':
        return '#f59e0b';
      case 'assigned':
        return '#38bdf8';
      case 'in_progress':
        return '#818cf8';
      case 'resolved':
        return '#10b981';
      case 'verified':
        return '#14b8a6';
      default:
        return '#94a3b8';
    }
  };

  const getIcon = () => {
    switch (complaint.department) {
      case 'water':
        return Droplets;
      case 'waste':
        return Trash2;
      case 'electricity':
        return Zap;
      case 'roads':
        return Construction;
      default:
        return AlertCircle;
    }
  };

  const Icon = getIcon();
  const color = getMarkerColor();
  const pos = [
    complaint.location?.coordinates?.x ?? 0,
    complaint.location?.coordinates?.y ?? 0.5,
    complaint.location?.coordinates?.z ?? 0,
  ];

  return (
    <group position={pos} ref={meshRef}>
      {/* 3D Pin Base Needle */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.1, 0.8, 8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* 3D Pin Head Sphere */}
      <mesh
        position={[0, 0.9, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick(complaint);
        }}
        castShadow
      >
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
          roughness={0.2}
        />
      </mesh>

      {/* HTML Interactive Tag / Tooltip */}
      <Html position={[0, 1.3, 0]} center distanceFactor={14} zIndexRange={[100, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick(complaint);
          }}
          className={`cursor-pointer transition-all duration-200 select-none ${
            isSelected ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-105'
          }`}
        >
          <div
            style={{ borderColor: color }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-950/90 text-[11px] font-bold text-white shadow-xl border backdrop-blur-md whitespace-nowrap"
          >
            <div
              style={{ backgroundColor: color }}
              className="w-4 h-4 rounded-full flex items-center justify-center text-slate-950"
            >
              <Icon className="w-2.5 h-2.5 text-white stroke-[3]" />
            </div>
            <span className="font-mono text-[10px] text-slate-300">{complaint.complaintId}</span>
            <span className="max-w-[110px] truncate text-slate-200">{complaint.title}</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
