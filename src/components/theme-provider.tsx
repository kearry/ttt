// src/components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Define the specific type for the attribute prop
type Attribute = "class" | "data-theme" | "data-mode";

// Define props interface with the correct attribute type
interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: Attribute | Attribute[];
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    storageKey?: string;
    themes?: string[];
    forcedTheme?: string;
}

export function ThemeProvider({
    children,
    ...props
}: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}