"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAIGame(userId: string) {
    if (!userId) {
        throw new Error("User ID is required to create a game");
    }

    // Create a new game with the user as player X and AI as player O
    const aiUser = await getOrCreateAIUser();

    if (!aiUser) {
        throw new Error("Could not create or find AI user");
    }

    const game = await prisma.game.create({
        data: {
            playerX: {
                connect: { id: userId }
            },
            playerO: {
                connect: { id: aiUser.id }
            }
        },
    });

    revalidatePath('/games');
    return game;
}

export async function makeAIMove(gameId: string) {
    // Find the game
    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { moves: true },
    });

    if (!game || game.status !== "ONGOING") {
        return null;
    }

    // Parse the current board
    const boardArray = game.board.split("");

    // Find empty cells
    const emptyCells = boardArray
        .map((cell, index) => (cell === "0" ? index : -1))
        .filter((index) => index !== -1);

    if (emptyCells.length === 0) {
        return null;
    }

    // Either make a winning move, block a potential win, or make a random move
    const position = getBestMove(boardArray);

    // Make the move
    boardArray[position] = "2"; // AI is always O
    const newBoard = boardArray.join("");

    // Create the move record
    await prisma.move.create({
        data: {
            gameId,
            player: "O",
            position,
        },
    });

    // Check for game end conditions
    const parsedBoard = boardArray.map(cell => {
        if (cell === "0") return null;
        if (cell === "1") return "X";
        if (cell === "2") return "O";
        return null;
    });

    const gameResult = checkGameResult(parsedBoard);

    const updateData: { board: string; status?: string; winner?: string | null } = { board: newBoard };

    if (gameResult) {
        if (gameResult === "draw") {
            updateData.status = "DRAW";
        } else if (gameResult === "X") {
            updateData.status = "PLAYER_X_WON";
            updateData.winner = game.playerXId;
        } else if (gameResult === "O") {
            updateData.status = "PLAYER_O_WON";
            updateData.winner = game.playerOId;
        }
    }

    // Update the game
    const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: updateData,
    });

    revalidatePath(`/game/${gameId}`);
    revalidatePath('/games');

    return updatedGame;
}

// Get or create the AI user account
async function getOrCreateAIUser() {
    const aiEmail = "ai@tictactoe.game";

    let aiUser = await prisma.user.findUnique({
        where: { email: aiEmail },
    });

    if (!aiUser) {
        aiUser = await prisma.user.create({
            data: {
                name: "AI Opponent",
                email: aiEmail,
                role: "AI",
            },
        });
    }

    return aiUser;
}

// Helper to find the best move for the AI
function getBestMove(board: string[]): number {
    // First, check if AI can win with next move
    const aiWinningMove = findWinningMove(board, "2");
    if (aiWinningMove !== -1) {
        return aiWinningMove;
    }

    // Then, check if player can win and block that move
    const playerWinningMove = findWinningMove(board, "1");
    if (playerWinningMove !== -1) {
        return playerWinningMove;
    }

    // Try to take the center if available
    if (board[4] === "0") {
        return 4;
    }

    // Try to take the corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => board[corner] === "0");
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available spot
    const emptyCells = board
        .map((cell, index) => (cell === "0" ? index : -1))
        .filter((index) => index !== -1);

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Find a winning move for a player
function findWinningMove(board: string[], player: string): number {
    // Check rows
    for (let i = 0; i < 9; i += 3) {
        if (
            board[i] === board[i + 1] && board[i] === player && board[i + 2] === "0"
        ) {
            return i + 2;
        }
        if (
            board[i] === board[i + 2] && board[i] === player && board[i + 1] === "0"
        ) {
            return i + 1;
        }
        if (
            board[i + 1] === board[i + 2] && board[i + 1] === player && board[i] === "0"
        ) {
            return i;
        }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
        if (
            board[i] === board[i + 3] && board[i] === player && board[i + 6] === "0"
        ) {
            return i + 6;
        }
        if (
            board[i] === board[i + 6] && board[i] === player && board[i + 3] === "0"
        ) {
            return i + 3;
        }
        if (
            board[i + 3] === board[i + 6] && board[i + 3] === player && board[i] === "0"
        ) {
            return i;
        }
    }

    // Check diagonals
    if (board[0] === board[4] && board[0] === player && board[8] === "0") {
        return 8;
    }
    if (board[0] === board[8] && board[0] === player && board[4] === "0") {
        return 4;
    }
    if (board[4] === board[8] && board[4] === player && board[0] === "0") {
        return 0;
    }

    if (board[2] === board[4] && board[2] === player && board[6] === "0") {
        return 6;
    }
    if (board[2] === board[6] && board[2] === player && board[4] === "0") {
        return 4;
    }
    if (board[4] === board[6] && board[4] === player && board[2] === "0") {
        return 2;
    }

    return -1;
}

// Helper function to check if the game is won or drawn
function checkGameResult(board: (string | null)[]): "X" | "O" | "draw" | null {
    // Check rows
    for (let i = 0; i < 9; i += 3) {
        if (
            board[i] &&
            board[i] === board[i + 1] &&
            board[i] === board[i + 2]
        ) {
            return board[i] as "X" | "O";
        }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
        if (
            board[i] &&
            board[i] === board[i + 3] &&
            board[i] === board[i + 6]
        ) {
            return board[i] as "X" | "O";
        }
    }

    // Check diagonals
    if (board[0] && board[0] === board[4] && board[0] === board[8]) {
        return board[0] as "X" | "O";
    }

    if (board[2] && board[2] === board[4] && board[2] === board[6]) {
        return board[2] as "X" | "O";
    }

    // Check for draw (if all cells are filled)
    if (!board.includes(null)) {
        return "draw";
    }

    // Game is still ongoing
    return null;
}