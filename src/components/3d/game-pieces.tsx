// src/components/3d/game-pieces.tsx
"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
//import { Text } from "@react-three/drei";
import * as THREE from "three";

interface PieceProps {
    position: [number, number, number];
    color: string;
    hoverColor: string;
    onClick?: () => void;
    isWinning?: boolean;
}

export function XPiece({ position, color, hoverColor, onClick, isWinning = false }: PieceProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!groupRef.current) return;

        if (isWinning) {
            const t = state.clock.getElapsedTime();
            groupRef.current.rotation.z = Math.sin(t * 3) * 0.1;
            groupRef.current.position.y = position[1] + Math.sin(t * 5) * 0.05 + 0.05;
        } else {
            groupRef.current.rotation.z = 0;
            groupRef.current.position.y = position[1];
        }
    });

    return (
        <group
            ref={groupRef}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={onClick}
        >
            {/* X is made of two crossing bars */}
            <mesh castShadow>
                <boxGeometry args={[0.6, 0.1, 0.1]} />
                <meshStandardMaterial
                    color={hovered ? hoverColor : color}
                    emissive={isWinning ? color : "#000000"}
                    emissiveIntensity={isWinning ? 0.5 : 0}
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>
            <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.8, 0.1, 0.1]} />
                <meshStandardMaterial
                    color={hovered ? hoverColor : color}
                    emissive={isWinning ? color : "#000000"}
                    emissiveIntensity={isWinning ? 0.5 : 0}
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>
            <mesh castShadow rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.8, 0.1, 0.1]} />
                <meshStandardMaterial
                    color={hovered ? hoverColor : color}
                    emissive={isWinning ? color : "#000000"}
                    emissiveIntensity={isWinning ? 0.5 : 0}
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>
        </group>
    );
}

export function OPiece({ position, color, hoverColor, onClick, isWinning = false }: PieceProps) {
    const torusRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!torusRef.current) return;

        if (isWinning) {
            const t = state.clock.getElapsedTime();
            torusRef.current.rotation.z = t * 1;
            torusRef.current.position.y = position[1] + Math.sin(t * 5) * 0.05 + 0.05;
        } else {
            torusRef.current.rotation.z = 0;
            torusRef.current.position.y = position[1];
        }
    });

    return (
        <mesh
            ref={torusRef}
            position={position}
            rotation={[Math.PI / 2, 0, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={onClick}
            castShadow
        >
            <torusGeometry args={[0.3, 0.1, 16, 32]} />
            <meshStandardMaterial
                color={hovered ? hoverColor : color}
                emissive={isWinning ? color : "#000000"}
                emissiveIntensity={isWinning ? 0.5 : 0}
                roughness={0.3}
                metalness={0.7}
            />
        </mesh>
    );
}
