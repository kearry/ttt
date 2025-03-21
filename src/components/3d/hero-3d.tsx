// src/components/3d/hero-3d.tsx
"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

function XPiece({ position = [0, 0, 0], color = "#3b82f6" }: {
    position?: [number, number, number];
    color?: string;
}) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;

        const t = state.clock.getElapsedTime();
        groupRef.current.rotation.y = t * 0.5;
    });

    return (
        <group ref={groupRef} position={position}>
            <mesh castShadow>
                <boxGeometry args={[0.6, 0.1, 0.1]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.8, 0.1, 0.1]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh castShadow rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.8, 0.1, 0.1]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
            </mesh>
        </group>
    );
}

function OPiece({ position = [0, 0, 0], color = "#ef4444" }: {
    position?: [number, number, number];
    color?: string;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.y = t * 0.5;
    });

    return (
        <mesh ref={meshRef} position={position} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.3, 0.1, 16, 32]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
        </mesh>
    );
}

function Board() {
    const boardRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!boardRef.current) return;

        const t = state.clock.getElapsedTime();
        boardRef.current.rotation.y = Math.sin(t * 0.2) * 0.5;
        boardRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    });

    return (
        <group ref={boardRef}>
            {/* Board base */}
            <mesh position={[0, -0.1, 0]} receiveShadow>
                <boxGeometry args={[3.5, 0.1, 3.5]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
            </mesh>

            {/* Grid lines */}
            <group>
                <mesh position={[0, 0.01, -0.5]} receiveShadow>
                    <boxGeometry args={[3, 0.05, 0.05]} />
                    <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
                </mesh>
                <mesh position={[0, 0.01, 0.5]} receiveShadow>
                    <boxGeometry args={[3, 0.05, 0.05]} />
                    <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
                </mesh>

                <mesh position={[-0.5, 0.01, 0]} receiveShadow>
                    <boxGeometry args={[0.05, 0.05, 3]} />
                    <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
                </mesh>
                <mesh position={[0.5, 0.01, 0]} receiveShadow>
                    <boxGeometry args={[0.05, 0.05, 3]} />
                    <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
                </mesh>
            </group>

            {/* Sample pieces */}
            <XPiece position={[-1, 0.1, -1]} />
            <OPiece position={[0, 0.1, 0]} />
            <XPiece position={[1, 0.1, 1]} />
            <OPiece position={[-1, 0.1, 1]} />
            <XPiece position={[1, 0.1, -1]} />

            {/* Title */}
            <Text
                position={[0, 1.5, 0]}
                color="#1e293b"
                fontSize={0.4}
                anchorX="center"
                anchorY="middle"
            >
                Tic-Tac-Toe 3D
            </Text>

            {/* Subtitle */}
            <Text
                position={[0, 1, 0]}
                color="#64748b"
                fontSize={0.2}
                anchorX="center"
                anchorY="middle"
            >
                Play now!
            </Text>
        </group>
    );
}

export default function Hero3D() {
    return (
        <div className="w-full h-full">
            <Suspense fallback={<div className="h-full flex items-center justify-center">Loading 3D Scene...</div>}>
                <Canvas shadows>
                    <PerspectiveCamera makeDefault fov={50} position={[0, 3, 5]} />

                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[5, 5, 5]}
                        intensity={0.8}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    <Board />

                    <OrbitControls
                        enablePan={false}
                        enableZoom={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 2.5}
                    />

                    <Environment preset="city" />
                </Canvas>
            </Suspense>
        </div>
    );
}