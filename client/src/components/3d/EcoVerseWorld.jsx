import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

import { CityQuarter } from './CityQuarter';
import { VillageQuarter } from './VillageQuarter';
import { RoadNetwork } from './RoadNetwork';
import { WaterInfrastructure } from './WaterInfrastructure';
import { WasteInfrastructure } from './WasteInfrastructure';
import { EnergyInfrastructure } from './EnergyInfrastructure';
import { PublicFacilities } from './PublicFacilities';
import { NatureElements } from './NatureElements';
import { Vehicles } from './Vehicles';
import { ComplaintMarker3D } from './ComplaintMarker3D';
import { ObjectInfoPanel } from './ObjectInfoPanel';
import { WorldControls } from './WorldControls';

// Component that animates camera when view preset changes
const CameraRig = ({ cameraView, controlsRef }) => {
  useEffect(() => {
    if (!controlsRef.current) return;

    if (cameraView === 'city') {
      controlsRef.current.target.set(6, 1.5, 3);
      controlsRef.current.object.position.set(12, 10, 10);
    } else if (cameraView === 'village') {
      controlsRef.current.target.set(-5, 1, -3);
      controlsRef.current.object.position.set(-11, 8, -8);
    } else {
      // Overview
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(16, 18, 20);
    }
    controlsRef.current.update();
  }, [cameraView]);

  return null;
};

export const EcoVerseWorld = ({
  complaints = [],
  onSelectComplaintExternal = null,
  isPickingLocation = false,
  setIsPickingLocation = null,
  onLocationPicked = null,
  initialFilter = 'all',
}) => {
  const [cameraView, setCameraView] = useState('overview');
  const [isNight, setIsNight] = useState(false);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [pickedPin, setPickedPin] = useState(null);

  const controlsRef = useRef();

  // Filter complaints based on active filter
  const filteredComplaints = complaints.filter((c) => {
    if (activeFilter === 'all') return true;
    return c.department === activeFilter;
  });

  const handleResetCamera = () => {
    setCameraView('overview');
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(16, 18, 20);
      controlsRef.current.update();
    }
  };

  const handleSelectObject = (obj) => {
    setSelectedComplaint(null);
    setSelectedObject(obj);
  };

  const handleSelectComplaint = (complaint) => {
    setSelectedObject(null);
    setSelectedComplaint(complaint);
    if (onSelectComplaintExternal) {
      onSelectComplaintExternal(complaint);
    }
  };

  const handleGroundClick = (e) => {
    if (!isPickingLocation) return;
    e.stopPropagation();
    const point = e.point;
    const coords = { x: Number(point.x.toFixed(1)), y: 0.5, z: Number(point.z.toFixed(1)) };
    setPickedPin(coords);
    if (onLocationPicked) {
      onLocationPicked(coords);
    }
    if (setIsPickingLocation) {
      setIsPickingLocation(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-950 overflow-hidden select-none">
      {/* 3D Scene Controls HUD */}
      <WorldControls
        cameraView={cameraView}
        setCameraView={setCameraView}
        isNight={isNight}
        setIsNight={setIsNight}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        onResetCamera={handleResetCamera}
        isPickingLocation={isPickingLocation}
        setIsPickingLocation={setIsPickingLocation}
        complaintCount={filteredComplaints.length}
      />

      {/* Picking Mode Banner */}
      {isPickingLocation && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-2xl backdrop-blur-md border border-rose-400 animate-bounce">
          🎯 Click anywhere on the 3D ground to place the complaint marker!
        </div>
      )}

      {/* R3F Canvas */}
      <Canvas
        shadows
        camera={{ position: [16, 18, 20], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        onPointerDown={handleGroundClick}
      >
        <color attach="background" args={[isNight ? '#050b14' : '#0c1a2e']} />

        {/* Lighting */}
        <ambientLight intensity={isNight ? 0.3 : 0.75} />
        <directionalLight
          position={isNight ? [-10, 15, -10] : [15, 25, 15]}
          intensity={isNight ? 0.4 : 1.3}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          color={isNight ? '#93c5fd' : '#ffffff'}
        />
        <hemisphereLight
          args={[isNight ? '#1e293b' : '#38bdf8', isNight ? '#090d16' : '#14532d', isNight ? 0.3 : 0.5]}
        />

        {/* Ambient Sky / Stars */}
        <Stars radius={60} depth={30} count={isNight ? 1500 : 300} factor={4} saturation={0.5} fade speed={1} />

        {/* Fog for depth atmospheric realism */}
        <fog attach="fog" args={[isNight ? '#050b14' : '#0c1a2e', 22, 60]} />

        {/* 3D World Infrastructure Modules */}
        <CityQuarter onSelectObject={handleSelectObject} />
        <VillageQuarter onSelectObject={handleSelectObject} />
        <RoadNetwork onSelectObject={handleSelectObject} />
        <WaterInfrastructure onSelectObject={handleSelectObject} />
        <WasteInfrastructure onSelectObject={handleSelectObject} />
        <EnergyInfrastructure onSelectObject={handleSelectObject} />
        <PublicFacilities onSelectObject={handleSelectObject} />
        <NatureElements />
        <Vehicles />

        {/* Live Database Complaint Markers */}
        {filteredComplaints.map((c) => (
          <ComplaintMarker3D
            key={c._id}
            complaint={c}
            isSelected={selectedComplaint?._id === c._id}
            onClick={handleSelectComplaint}
          />
        ))}

        {/* Picked Pin Temporary Marker in Location Selection Mode */}
        {pickedPin && (
          <mesh position={[pickedPin.x, 0.6, pickedPin.z]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.8} />
          </mesh>
        )}

        {/* Camera Controls & Animation Rig */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={48}
        />
        <CameraRig cameraView={cameraView} controlsRef={controlsRef} />
      </Canvas>

      {/* Selected 3D Object or Complaint Info Drawer */}
      <ObjectInfoPanel
        selectedObject={selectedObject}
        selectedComplaint={selectedComplaint}
        onClose={() => {
          setSelectedObject(null);
          setSelectedComplaint(null);
        }}
      />
    </div>
  );
};
