// src/components/game-status.tsx
"use client";

import { useGame } from "@/contexts/game-context";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

export default function GameStatus() {
    const { status, isPlayerTurn, currentTurn, userRole, board, isGameOver } = useGame();

    function getStatusMessage() {
        if (isGameOver) {
            switch (status) {
                case "PLAYER_X_WON":
                    return userRole === "X" ? "You won! 🎉" : "Player X won";
                case "PLAYER_O_WON":
                    return userRole === "O" ? "You won! 🎉" : "Player O won";
                case "DRAW":
                    return "Game ended in a draw";
                default:
                    return "Game over";
            }
        }

        return isPlayerTurn ? "Your turn" : "Opponent's turn";
    }

    function getStatusIcon() {
        if (isGameOver) {
            if (status === "DRAW") {
                return <AlertCircle className="h-5 w-5 text-orange-500" />;
            }

            const isWinner =
                (status === "PLAYER_X_WON" && userRole === "X") ||
                (status === "PLAYER_O_WON" && userRole === "O");

            return isWinner ?
                <CheckCircle className="h-5 w-5 text-green-500" /> :
                <AlertCircle className="h-5 w-5 text-red-500" />;
        }

        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
    }

    // Count remaining empty cells
    const remainingMoves = board.filter(cell => cell === "").length;

    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {getStatusIcon()}
                        <span className="font-medium">{getStatusMessage()}</span>
                    </div>

                    {!isGameOver && (
                        <div className="text-sm text-muted-foreground">
                            {remainingMoves} moves remaining
                        </div>
                    )}
                </div>

                {!isGameOver && (
                    <div className="mt-2 flex items-center space-x-2">
                        <div className={`h-2 w-2 rounded-full ${currentTurn === "X" ? "bg-primary" : "bg-secondary"}`}></div>
                        <span className="text-sm">{currentTurn === "X" ? "Player X" : "Player O"}&apos;s turn</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}