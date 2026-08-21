import { useCallback, useEffect, useState } from "react";

const KEY = "uk-theme";

export type Theme = "dark" | "light";

const listeners = new Set<(t: Theme) => void>();
let current: Theme = "dark";

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme: Theme) {
  current = theme;
  localStorage.setItem(KEY, theme);
  apply(theme);
  listeners.forEach((l) => l(theme));
}

export function useTheme() {
  const [theme, setLocal] = useState<Theme>(current);

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Theme | null) ?? "dark";
    current = stored;
    apply(stored);
    setLocal(stored);
    listeners.add(setLocal);
    return () => {
      listeners.delete(setLocal);
    };
  }, []);

  const toggle = useCallback(() => {
    setTheme(current === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggle };
}
