// src/types/game-types.ts
export type BoardCell = "" | "X" | "O";
export type GameStatus = "ONGOING" | "PLAYER_X_WON" | "PLAYER_O_WON" | "DRAW";

export interface GameData {
    id: string;
    playerXId: string;
    playerOId: string | null;
    board: string;
    status: GameStatus;
    playerX: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    playerO?: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
    moves: Array<{
        id: string;
        gameId: string;
        player: string;
        position: number;
        createdAt: Date;
    }>;
}