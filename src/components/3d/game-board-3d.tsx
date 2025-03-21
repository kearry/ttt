// src/components/3d/game-board-3d.tsx
"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import { useGame } from "@/contexts/game-context";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { makeAIMove } from "@/lib/actions/ai-actions";
import { useRouter } from "next/navigation";

// Cell component for board
function Cell({ position, value, onClick, isWinningCell, theme }: {
    position: [number, number, number];
    index: number;
    value: "" | "X" | "O";
    onClick: () => void;
    isWinningCell: boolean;
    theme: "light" | "dark";
}) {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    // Handle animation
    useFrame((state) => {
        if (!meshRef.current) return;

        // Hover animation
        if (hovered && !value) {
            meshRef.current.scale.setScalar(1.1);
        } else {
            meshRef.current.scale.setScalar(1);
        }

        // Winning cell animation
        if (isWinningCell) {
            const t = state.clock.getElapsedTime();
            const material = meshRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = Math.sin(t * 4) * 0.5 + 0.5;
        } else {
            const material = meshRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = 0;
        }
    });

    // Create material colors based on theme
    const cellColor = theme === "light" ? "#f5f5f5" : "#333333";
    const hoverColor = theme === "light" ? "#e2e8f0" : "#444444";
    const xColor = theme === "light" ? "#3b82f6" : "#60a5fa";
    const oColor = theme === "light" ? "#ef4444" : "#f87171";
    const emissiveColor = isWinningCell ? "#ffcc00" : "#000000";

    // Cell click handler
    const handleClick = () => {
        if (!value) {
            onClick();
        }
    };

    return (
        <mesh
            ref={meshRef}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={handleClick}
        >
            <boxGeometry args={[0.9, 0.2, 0.9]} />
            <meshStandardMaterial
                color={hovered && !value ? hoverColor : cellColor}
                emissive={emissiveColor}
                emissiveIntensity={isWinningCell ? 1 : 0}
                roughness={0.5}
                metalness={0.2}
            />

            {/* Render X or O */}
            {value && (
                <Text
                    position={[0, 0.15, 0]}
                    fontSize={0.7}
                    color={value === "X" ? xColor : oColor}
                    anchorX="center"
                    anchorY="middle"
                >
                    {value}
                </Text>
            )}
        </mesh>
    );
}

// Board component
function Board({ theme = "light" }: { theme?: "light" | "dark" }) {
    const { board, handleCellClick, canMakeMove, status } = useGame();

    // Calculate winning cells if game is over
    const winningCells = [] as number[];

    if (status !== "ONGOING") {
        // Check rows
        for (let i = 0; i < 9; i += 3) {
            if (
                board[i] &&
                board[i] === board[i + 1] &&
                board[i] === board[i + 2]
            ) {
                winningCells.push(i, i + 1, i + 2);
                break;
            }
        }

        // Check columns
        for (let i = 0; i < 3; i++) {
            if (
                board[i] &&
                board[i] === board[i + 3] &&
                board[i] === board[i + 6]
            ) {
                winningCells.push(i, i + 3, i + 6);
                break;
            }
        }

        // Check diagonals
        if (board[0] && board[0] === board[4] && board[0] === board[8]) {
            winningCells.push(0, 4, 8);
        }

        if (board[2] && board[2] === board[4] && board[2] === board[6]) {
            winningCells.push(2, 4, 6);
        }
    }

    return (
        <group>
            {/* Board base */}
            <mesh position={[0, -0.1, 0]} receiveShadow>
                <boxGeometry args={[3.5, 0.1, 3.5]} />
                <meshStandardMaterial
                    color={theme === "light" ? "#e2e8f0" : "#111827"}
                    roughness={0.7}
                />
            </mesh>

            {/* Grid lines */}
            <group>
                {/* Horizontal grid lines */}
                <mesh position={[0, 0.01, -0.5]} receiveShadow>
                    <boxGeometry args={[3, 0.05, 0.05]} />
                    <meshStandardMaterial
                        color={theme === "light" ? "#cbd5e1" : "#1f2937"}
                        roughness={0.5}
                    />
                </mesh>
                <mesh position={[0, 0.01, 0.5]} receiveShadow>
                    <boxGeometry args={[3, 0.05, 0.05]} />
                    <meshStandardMaterial
                        color={theme === "light" ? "#cbd5e1" : "#1f2937"}
                        roughness={0.5}
                    />
                </mesh>

                {/* Vertical grid lines */}
                <mesh position={[-0.5, 0.01, 0]} receiveShadow>
                    <boxGeometry args={[0.05, 0.05, 3]} />
                    <meshStandardMaterial
                        color={theme === "light" ? "#cbd5e1" : "#1f2937"}
                        roughness={0.5}
                    />
                </mesh>
                <mesh position={[0.5, 0.01, 0]} receiveShadow>
                    <boxGeometry args={[0.05, 0.05, 3]} />
                    <meshStandardMaterial
                        color={theme === "light" ? "#cbd5e1" : "#1f2937"}
                        roughness={0.5}
                    />
                </mesh>
            </group>

            {/* Cells */}
            <group>
                {board.map((value, index) => {
                    // Calculate 3D position from index
                    const x = (index % 3) - 1;
                    const z = Math.floor(index / 3) - 1;

                    return (
                        <Cell
                            key={index}
                            position={[x, 0.1, z]}
                            index={index}
                            value={value}
                            onClick={() => canMakeMove && handleCellClick(index)}
                            isWinningCell={winningCells.includes(index)}
                            theme={theme}
                        />
                    );
                })}
            </group>
        </group>
    );
}

// Camera setup for the 3D scene
function CameraSetup() {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 5, 4);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
}

// Main 3D Game Board component
export default function GameBoard3D() {
    const { isLoading, error, isGameOver, gameData, board, userRole } = useGame();
    const [use3D, setUse3D] = useState(true);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [waitingForAI, setWaitingForAI] = useState(false);
    const router = useRouter();

    // Detect system theme preference
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');

        const handler = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? 'dark' : 'light');
        };

        darkModeMediaQuery.addEventListener('change', handler);
        return () => darkModeMediaQuery.removeEventListener('change', handler);
    }, []);

    // Check if opponent is AI
    const isAIOpponent = gameData.playerO?.email === "ai@tictactoe.game";

    // Automatically make AI move if it's their turn
    useEffect(() => {
        // Count filled cells to determine if it's AI's turn
        const filledCells = board.filter(cell => cell !== "").length;

        const isAITurn =
            isAIOpponent &&
            !isGameOver &&
            !waitingForAI &&
            !isLoading &&
            userRole === "X" && // User is always X against AI
            filledCells % 2 === 1; // AI's turn (odd number of moves)

        console.log("3D: AI turn check:", {
            isAIOpponent,
            isGameOver,
            waitingForAI,
            isLoading,
            userRole,
            filledCells,
            isAITurn
        });

        if (isAITurn) {
            const makeMove = async () => {
                setWaitingForAI(true);
                try {
                    console.log("3D: Making AI move for game:", gameData.id);
                    await makeAIMove(gameData.id);
                    router.refresh();
                } catch (error) {
                    console.error("3D: AI move error:", error);
                } finally {
                    setWaitingForAI(false);
                }
            };

            // Add a small delay to make it feel like the AI is "thinking"
            const timeoutId = setTimeout(makeMove, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [board, isAIOpponent, isGameOver, waitingForAI, isLoading, userRole, gameData.id, router]);

    if (!use3D) {
        // Fallback to 2D board if user disables 3D
        return (
            <div>
                <Card className="p-4 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">3D Mode</span>
                        <Button
                            onClick={() => setUse3D(true)}
                            size="sm"
                            variant="outline"
                        >
                            Enable 3D
                        </Button>
                    </div>
                </Card>

                {/* Render the normal 2D game board here */}
                <EnhancedGameBoard />
            </div>
        );
    }

    return (
        <div className="relative">
            <Card className="p-4 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm">3D Mode</span>
                    <Button
                        onClick={() => setUse3D(false)}
                        size="sm"
                        variant="outline"
                    >
                        Disable 3D
                    </Button>
                </div>
            </Card>

            <div className="w-full aspect-square rounded-lg overflow-hidden">
                <Suspense fallback={<div className="h-full flex items-center justify-center">Loading 3D Board...</div>}>
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault fov={50} position={[0, 3, 5]} />
                        <CameraSetup />

                        <ambientLight intensity={0.4} />
                        <directionalLight
                            position={[5, 5, 5]}
                            intensity={0.8}
                            castShadow
                            shadow-mapSize={[1024, 1024]}
                        />

                        <Board theme={theme} />

                        <ContactShadows
                            position={[0, -0.09, 0]}
                            opacity={0.6}
                            scale={10}
                            blur={1}
                            far={10}
                            resolution={256}
                            color={theme === "light" ? "#000000" : "#ffffff"}
                        />

                        <OrbitControls
                            enablePan={false}
                            enableZoom={true}
                            minPolarAngle={Math.PI / 6}
                            maxPolarAngle={Math.PI / 2.5}
                            minDistance={3}
                            maxDistance={7}
                        />

                        <Environment preset="city" />
                    </Canvas>
                </Suspense>

                {waitingForAI && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4 mx-auto"></div>
                            <p className="font-medium">AI is thinking...</p>
                        </div>
                    </div>
                )}

                {isLoading && !waitingForAI && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-2 bg-destructive/10 border border-destructive text-destructive rounded">
                        {error}
                    </div>
                )}

                {isGameOver && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button
                            onClick={() => window.location.href = "/game/new"}
                            className="w-full"
                        >
                            New Game
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = "/games"}
                            className="w-full"
                        >
                            Game History
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Import the original 2D board as fallback
import EnhancedGameBoard from "@/components/enhanced-game-board";