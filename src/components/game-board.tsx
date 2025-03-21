// src/components/game-board.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { makeMove, joinGame } from "@/lib/actions/game-actions";
import { useRouter } from "next/navigation";

interface GameBoardProps {
    game: {
        id: string;
        board: string;
        status: "ONGOING" | "PLAYER_X_WON" | "PLAYER_O_WON" | "DRAW";
        playerX: { name: string | null };
        playerO?: { name: string | null };
        playerOId: string | null;
    };
    userRole: string;
    userId: string;
}

export default function GameBoard({ game, userRole, userId }: GameBoardProps) {
    const [board, setBoard] = useState<string[]>(Array(9).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Current player's turn
    const isGameOver = game.status !== "ONGOING";
    const isPlayerTurn =
        (userRole === "X" && countMoves() % 2 === 0) ||
        (userRole === "O" && countMoves() % 2 === 1);

    // Determine if user can make a move (it's their turn and game is ongoing)
    const canMakeMove = !isGameOver && isPlayerTurn && game.playerOId !== null;

    // Parse the board state from the database
    useEffect(() => {
        const boardState = game.board.split("").map((cell: string) => {
            if (cell === "1") return "X";
            if (cell === "2") return "O";
            return "";
        });
        setBoard(boardState);
    }, [game.board]);

    function countMoves() {
        return board.filter(cell => cell !== "").length;
    }

    async function handleCellClick(index: number) {
        if (board[index] !== "" || !canMakeMove || isLoading) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await makeMove({
                gameId: game.id,
                position: index,
                player: userRole,
                userId: userId
            });

            // Refresh the data
            router.refresh();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to make move");
            } else {
                setError("Failed to make move");
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleJoinGame() {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            await joinGame({
                gameId: game.id,
                userId: userId
            });

            // Refresh the data
            router.refresh();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to join game");
            } else {
                setError("Failed to join game");
            }
        } finally {
            setIsLoading(false);
        }
    }

    // Get appropriate status message based on game state
    function getStatusMessage() {
        if (isGameOver) {
            switch (game.status) {
                case "PLAYER_X_WON":
                    return `Player X (${game.playerX.name || "Unknown"}) has won!`;
                case "PLAYER_O_WON":
                    return `Player O (${game.playerO?.name || "Unknown"}) has won!`;
                case "DRAW":
                    return "Game ended in a draw!";
                default:
                    return "Game over";
            }
        }

        if (!game.playerOId) {
            return "Waiting for an opponent to join...";
        }

        return isPlayerTurn ? "Your turn" : "Opponent's turn";
    }

    // Render waiting screen if player O hasn't joined yet and user is not player X
    if (!game.playerOId && userRole === "O") {
        return (
            <Card className="p-6 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-4">Join this game?</h2>
                <p className="text-center mb-6">
                    You&apos;ve been invited to play against {game.playerX.name || "Player X"}
                </p>
                <Button
                    onClick={handleJoinGame}
                    disabled={isLoading}
                    className="w-full max-w-xs"
                >
                    {isLoading ? "Joining..." : "Join Game as Player O"}
                </Button>

                {error && (
                    <div className="mt-4 p-2 bg-destructive/10 border border-destructive text-destructive rounded">
                        {error}
                    </div>
                )}
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="mb-4 text-center font-medium">
                {getStatusMessage()}
            </div>

            <div className="grid grid-cols-3 gap-2 aspect-square">
                {board.map((cell, index) => (
                    <Button
                        key={index}
                        variant={cell ? (cell === "X" ? "default" : "secondary") : "outline"}
                        className="aspect-square text-3xl h-full font-bold"
                        onClick={() => handleCellClick(index)}
                        disabled={!canMakeMove || cell !== "" || isLoading}
                    >
                        {cell}
                    </Button>
                ))}
            </div>

            {error && (
                <div className="mt-4 p-2 bg-destructive/10 border border-destructive text-destructive rounded">
                    {error}
                </div>
            )}

            {isGameOver && (
                <div className="mt-4">
                    <Button
                        onClick={() => router.push("/game/new")}
                        className="w-full"
                    >
                        New Game
                    </Button>
                </div>
            )}
        </Card>
    );
}