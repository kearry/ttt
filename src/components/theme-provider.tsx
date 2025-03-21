// src/components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Define props interface with all needed props
interface ThemeProviderCompProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    [x: string]: any; // Allow any other props
}

// Use JSX.IntrinsicAttributes to tell TypeScript to allow any props
export function ThemeProvider(props: ThemeProviderCompProps): JSX.Element {
    // Pass all props to the NextThemesProvider
    return <NextThemesProvider {...props} />;
}