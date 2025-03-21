"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGame(userId: string) {
    if (!userId) {
        throw new Error("User ID is required to create a game");
    }

    // Create a new game with the user as player X
    const game = await prisma.game.create({
        data: {
            playerX: {
                connect: { id: userId }
            }
        }
    });

    revalidatePath('/games');
    return game;
}

export async function makeMove({
    gameId,
    position,
    player,
    userId
}: {
    gameId: string;
    position: number;
    player: string;
    userId: string;
}) {
    if (!userId) {
        throw new Error("User ID is required to make a move");
    }

    // Find the game
    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { moves: true },
    });

    if (!game) {
        throw new Error("Game not found");
    }

    // Check if the game is still ongoing
    if (game.status !== "ONGOING") {
        throw new Error("Game is already over");
    }

    // Check if it's the player's turn
    const currentPlayer = game.moves.length % 2 === 0 ? "X" : "O";
    if (player !== currentPlayer) {
        throw new Error("It's not your turn");
    }

    // Verify the player is authorized to make this move
    if (
        (player === "X" && game.playerXId !== userId) ||
        (player === "O" && game.playerOId !== userId)
    ) {
        throw new Error("You are not authorized to make this move");
    }

    // Check if the position is valid
    if (position < 0 || position > 8) {
        throw new Error("Invalid position");
    }

    // Parse the current board
    const boardArray = game.board.split("");

    // Check if the cell is already occupied
    if (boardArray[position] !== "0") {
        throw new Error("This cell is already occupied");
    }

    // Make the move
    boardArray[position] = player === "X" ? "1" : "2";
    const newBoard = boardArray.join("");

    // Create the move record
    await prisma.move.create({
        data: {
            gameId,
            player,
            position,
        },
    });

    // If player O doesn't exist yet and this is player O's move, update playerOId
    let updateData: any = { board: newBoard };
    if (player === "O" && !game.playerOId) {
        updateData.playerO = {
            connect: { id: userId }
        };
    }

    // Check if the game is won or drawn
    const parsedBoard = boardArray.map(cell => {
        if (cell === "0") return null;
        if (cell === "1") return "X";
        if (cell === "2") return "O";
        return null;
    });

    const gameResult = checkGameResult(parsedBoard);

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

// Helper function to join a game as player O
export async function joinGame({
    gameId,
    userId
}: {
    gameId: string;
    userId: string;
}) {
    if (!userId) {
        throw new Error("User ID is required to join a game");
    }

    const game = await prisma.game.findUnique({
        where: { id: gameId },
    });

    if (!game) {
        throw new Error("Game not found");
    }

    if (game.playerXId === userId) {
        throw new Error("You can't join your own game");
    }

    if (game.playerOId) {
        throw new Error("This game already has a player O");
    }

    const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
            playerO: {
                connect: { id: userId }
            }
        },
    });

    revalidatePath(`/game/${gameId}`);
    revalidatePath('/games');

    return updatedGame;
}