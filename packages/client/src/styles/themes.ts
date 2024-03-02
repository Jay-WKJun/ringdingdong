import { TalkToMeTheme } from ".";

const lightTheme: TalkToMeTheme = {
  textColor: "#000",
  backgroundColor: "#fff",
  backgroundColor2: "#f9f9f9",
  loadingSpinnerColor: "#000",
  boxShadowColor: "rgba(0, 0, 0, 0.3)",
  hoverColor: "#f0f0f0",
  chatBackgroundColor: "#c9c5c5",
  borderColor: "#ccc",
  avatarBackgroundColor: "red",
};

const darkTheme: TalkToMeTheme = {
  textColor: "#fff",
  backgroundColor: "#000",
  backgroundColor2: "#3f3f3f",
  loadingSpinnerColor: "#fff",
  boxShadowColor: "rgba(255, 255, 255, 0.3)",
  hoverColor: "#1f1f1f",
  chatBackgroundColor: "#2f2f2f",
  borderColor: "#333",
  avatarBackgroundColor: "red",
};

export const themes: Record<string, TalkToMeTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
