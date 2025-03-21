// src/components/3d/game-status-3d.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useGame } from "@/contexts/game-context";
import * as THREE from "three";

export default function GameStatus3D({ theme = "light" }: { theme?: "light" | "dark" }) {
    const { status, isPlayerTurn, currentTurn, userRole } = useGame();
    const textRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!textRef.current) return;

        const t = state.clock.getElapsedTime();
        textRef.current.position.y = 2 + Math.sin(t * 2) * 0.1;
    });

    function getStatusMessage() {
        if (status !== "ONGOING") {
            switch (status) {
                case "PLAYER_X_WON":
                    return userRole === "X" ? "You won! 🎉" : "X won the game";
                case "PLAYER_O_WON":
                    return userRole === "O" ? "You won! 🎉" : "O won the game";
                case "DRAW":
                    return "Game ended in a draw";
                default:
                    return "Game over";
            }
        }

        return isPlayerTurn ? "Your turn" : `Waiting for ${currentTurn}`;
    }

    // Colors based on theme
    const textColor = theme === "light" ? "#1e293b" : "#f8fafc";

    return (
        <group position={[0, 2, 0]} ref={textRef}>
            <Text
                color={textColor}
                fontSize={0.3}
                font="/fonts/inter-bold.woff"
                anchorX="center"
                anchorY="middle"
            >
                {getStatusMessage()}
            </Text>
        </group>
    );
}