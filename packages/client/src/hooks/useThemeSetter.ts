import { useMemo } from "react";

export function useThemeSetter<T extends object>(
  themes: Record<string, T>,
  themeMode?: string,
) {
  return useMemo(() => {
    const themeRes = themeMode && themes[themeMode];
    if (themeRes) return themeRes;

    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const systemMode = isDark ? "dark" : "light";

    return themes[systemMode] as T;
  }, [themeMode, themes]);
}
