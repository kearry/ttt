// src/components/theme-provider.tsx
"use client";

import * as React from "react";
// @ts-expect-error - Ignore type checking for this import
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.PropsWithChildren<any>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}