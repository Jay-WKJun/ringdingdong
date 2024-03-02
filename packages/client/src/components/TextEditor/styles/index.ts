import type { TextControllerTheme } from "./type";

export * from "./type";

const lightTheme: TextControllerTheme = {
  textColor: "#000",
  backgroundColor: "#fff",
  backgroundColor2: "#f9f9f9",
  hoverColor: "#f0f0f0",
  borderColor: "#ccc",
};

const darkTheme: TextControllerTheme = {
  textColor: "#fff",
  backgroundColor: "#000",
  backgroundColor2: "#3f3f3f",
  hoverColor: "#1f1f1f",
  borderColor: "#333",
};

export const textControllerThemes: Record<string, TextControllerTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
