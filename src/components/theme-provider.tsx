"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// We omit the generic typescript requirement for ThemeProviderProps since it may clash with different versions
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
