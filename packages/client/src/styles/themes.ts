import { TalkToMeTheme } from ".";

const lightTheme: TalkToMeTheme = {
  textColor: "#000",
  backgroundColor: "#fff",
  backgroundColor2: "#f9f9f9",
  loadingSpinnerColor: "#000",
  boxShadowColor: "rgba(0, 0, 0, 0.3)",
  hoverColor: "#f0f0f0",
  chatBackgroundColor: "#f0f0f0",
  borderColor: "#ccc",
  avatarBackgroundColor: "red",
};

export const themes: Record<string, TalkToMeTheme> = {
  light: lightTheme,
};
