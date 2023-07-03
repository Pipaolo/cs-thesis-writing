import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "var(--font-inter)",
    body: "var(--font-inter)",
  },
  colors: {
    primary: {
      50: "#9ca1e2",
      100: "#757bd7",
      200: "#6168d1",
      300: "#4d55cb",
      400: "#3a42c6",
      500: "#2e359e",
      600: "#232877",
      700: "#1d2163",
      800: "#171b4f",
      900: "#0c0d28",
    },
    secondary: {
      50: "#ffffff",
      100: "#ffffff",
      200: "#ffffff",
      300: "#ffffff",
      400: "#fbfbfe",
      500: "#d4d6f2",
      600: "#adb1e6",
      700: "#999ee0",
      800: "#868bda",
      900: "#5f66ce",
    },
    accent: {
      50: "#b0b4e8",
      100: "#898edd",
      200: "#757bd7",
      300: "#6269d1",
      400: "#4e56cb",
      500: "#343cb2",
      600: "#282f8b",
      700: "#232877",
      800: "#1d2163",
      900: "#11143c",
    },

    text: "#08091c",
    background: "#e7e8f8",
  },
});
