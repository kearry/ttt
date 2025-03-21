// src/components/enhanced-game-board.tsx (updated)
"use client";

import { useEffect } from "react";
import { useGame } from "@/contexts/game-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { makeAIMove } from "@/lib/actions/ai-actions";

export default function EnhancedGameBoard() {
    const {
        board,
        handleCellClick,
        isLoading,
        canMakeMove,
        error,
        isGameOver,
        userRole,
        gameData
    } = useGame();

    const router = useRouter();
    const [lastMoveIndex, setLastMoveIndex] = useState<number | null>(null);
    const [waitingForAI, setWaitingForAI] = useState(false);

    // Check if opponent is AI
    const isAIOpponent = gameData.playerO?.email === "ai@tictactoe.game";

    // Automatically make AI move if it's their turn
    useEffect(() => {
        const isAITurn =
            isAIOpponent &&
            !isGameOver &&
            !waitingForAI &&
            !isLoading &&
            userRole === "X" && // User is always X against AI
            board.filter(cell => cell !== "").length % 2 === 1; // AI's turn (odd number of moves)

        if (isAITurn) {
            const makeMove = async () => {
                setWaitingForAI(true);
                try {
                    await makeAIMove(gameData.id);
                    router.refresh();
                } catch (error) {
                    console.error("AI move error:", error);
                } finally {
                    setWaitingForAI(false);
                }
            };

            // Add a small delay to make it feel like the AI is "thinking"
            const timeoutId = setTimeout(makeMove, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [board, isAIOpponent, isGameOver, waitingForAI, isLoading, userRole, gameData.id, router]);

    // Highlight last move with animation
    const handleClick = async (index: number) => {
        await handleCellClick(index);
        setLastMoveIndex(index);
    };

    // Reset last move highlight after each board update
    useEffect(() => {
        setLastMoveIndex(null);
    }, [board]);

    return (
        <Card className="p-6">
            {waitingForAI && (
                <div className="mb-4 text-center font-medium">
                    AI is thinking... <span className="inline-block animate-pulse">🤖</span>
                </div>
            )}

            <div className="grid grid-cols-3 gap-2 aspect-square">
                {board.map((cell, index) => (
                    <Button
                        key={index}
                        variant={
                            cell
                                ? (cell === "X" ? "default" : "secondary")
                                : "outline"
                        }
                        className={`
              aspect-square text-3xl h-full font-bold
              ${lastMoveIndex === index ? "ring-4 ring-primary ring-opacity-50" : ""}
              ${canMakeMove && cell === "" ? "hover:bg-primary/10" : ""}
              transition-all
            `}
                        onClick={() => handleClick(index)}
                        disabled={!canMakeMove || cell !== "" || isLoading || waitingForAI}
                    >
                        {cell}
                    </Button>
                ))}
            </div>

            {error && (
                <div className="mt-4 p-2 bg-destructive/10 border border-destructive text-destructive rounded flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>{error}</span>
                </div>
            )}

            {isGameOver && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                        onClick={() => router.push("/game/new")}
                        className="w-full"
                    >
                        New Game
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/games")}
                        className="w-full"
                    >
                        Game History
                    </Button>
                </div>
            )}
        </Card>
    );
}
