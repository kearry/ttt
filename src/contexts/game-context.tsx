// src/contexts/game-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { makeMove, joinGame } from "@/lib/actions/game-actions";

// Define types for game state
type BoardCell = "" | "X" | "O";
type GameStatus = "ONGOING" | "PLAYER_X_WON" | "PLAYER_O_WON" | "DRAW";

interface GameContextType {
    board: BoardCell[];
    isLoading: boolean;
    error: string | null;
    isGameOver: boolean;
    isPlayerTurn: boolean;
    canMakeMove: boolean;
    currentTurn: "X" | "O";
    status: GameStatus;
    userRole: string;
    handleCellClick: (index: number) => Promise<void>;
    handleJoinGame: () => Promise<void>;
    resetError: () => void;
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Game provider props
interface GameProviderProps {
    children: React.ReactNode;
    gameData: any;
    userRole: string;
    userId: string;
}

// Provider component
export function GameProvider({ children, gameData, userRole, userId }: GameProviderProps) {
    const [board, setBoard] = useState<BoardCell[]>(Array(9).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Update board when game data changes
    useEffect(() => {
        const boardState = gameData.board.split("").map((cell: string) => {
            if (cell === "1") return "X";
            if (cell === "2") return "O";
            return "";
        }) as BoardCell[];
        setBoard(boardState);
    }, [gameData.board]);

    // Derived state
    const isGameOver = gameData.status !== "ONGOING";
    const currentTurn = board.filter(cell => cell !== "").length % 2 === 0 ? "X" : "O";
    const isPlayerTurn = userRole === currentTurn;
    const canMakeMove = !isGameOver && isPlayerTurn && gameData.playerOId !== null;

    // Handle making a move
    async function handleCellClick(index: number) {
        if (board[index] !== "" || !canMakeMove || isLoading) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await makeMove({
                gameId: gameData.id,
                position: index,
                player: userRole,
                userId: userId
            });

            // Refresh the data
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to make move");
        } finally {
            setIsLoading(false);
        }
    }

    // Handle joining a game
    async function handleJoinGame() {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            await joinGame({
                gameId: gameData.id,
                userId: userId
            });

            // Refresh the data
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to join game");
        } finally {
            setIsLoading(false);
        }
    }

    // Reset error
    function resetError() {
        setError(null);
    }

    // Create context value
    const contextValue: GameContextType = {
        board,
        isLoading,
        error,
        isGameOver,
        isPlayerTurn,
        canMakeMove,
        currentTurn,
        status: gameData.status,
        userRole,
        handleCellClick,
        handleJoinGame,
        resetError
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
}

// Create a hook to use the game context
export function useGame() {
    const context = useContext(GameContext);

    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }

    return context;
}
