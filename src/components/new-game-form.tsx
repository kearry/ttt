// src/components/new-game-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createGame } from "@/lib/actions/game-actions";
import { createAIGame } from "@/lib/actions/ai-actions";
import { Bot, Users } from "lucide-react";

interface NewGameFormProps {
    userId: string;
}

export default function NewGameForm({ userId }: NewGameFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [opponentType, setOpponentType] = useState<"human" | "ai">("human");
    const router = useRouter();

    async function handleCreateGame() {
        setIsLoading(true);
        try {
            if (opponentType === "ai") {
                const game = await createAIGame(userId);
                router.push(`/game/${game.id}`);
            } else {
                const game = await createGame(userId);
                router.push(`/game/${game.id}`);
            }
        } catch (error) {
            console.error("Failed to create game:", error);
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create a new Tic-Tac-Toe game</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <p>
                    Choose your opponent type and start a new game. You&apos;ll play as X.
                </p>

                <RadioGroup
                    defaultValue={opponentType}
                    onValueChange={(value) => setOpponentType(value as "human" | "ai")}
                    className="grid grid-cols-2 gap-4"
                >
                    <div>
                        <RadioGroupItem
                            value="human"
                            id="human"
                            className="peer sr-only"
                        />
                        <Label
                            htmlFor="human"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            <Users className="mb-3 h-6 w-6" />
                            <p className="font-medium">Human Opponent</p>
                            <p className="text-sm text-muted-foreground">
                                Create a game and invite a friend to play
                            </p>
                        </Label>
                    </div>

                    <div>
                        <RadioGroupItem
                            value="ai"
                            id="ai"
                            className="peer sr-only"
                        />
                        <Label
                            htmlFor="ai"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            <Bot className="mb-3 h-6 w-6" />
                            <p className="font-medium">AI Opponent</p>
                            <p className="text-sm text-muted-foreground">
                                Play against our AI opponent
                            </p>
                        </Label>
                    </div>
                </RadioGroup>

                <Button
                    onClick={handleCreateGame}
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? "Creating..." : "Create Game"}
                </Button>
            </CardContent>
        </Card>
    );
}