import { ThemeOptions } from "@mui/material/styles";

interface customPaletteColors {
  softColor?: string;
  simpleColor?: string;
  lightColor?: string;
  warmColor?: string;
  mediumColor?: string;
  classicColor?: string;
  coolColor?: string;
  gentelColor?: string;
  pureColor?: string;
  darkColor?: string;
  intenseColor?: string;
  fullDarkColor?: string;
  neonColor?: string;

  darkGrey?: string;
  lightGrey?: string;
  200?: string;
  300?: string;
  500?: string;
  700?: string;
  1000?: string;
  1100?: string;
}

interface backgroundPaletteColors {
  main?: string;
  light?: string;
}

declare module "@mui/material/styles" {
  interface PaletteColor extends customPaletteColors {}
  interface SimplePaletteColorOptions extends customPaletteColors {}
  interface TypeBackground extends backgroundPaletteColors {}
}

export const colorTokens = {
  mainColor: {
    50: "#e3f2fd",
    100: "#cddbff",
    200: "#9ab2ef",
    300: "#739ae5",
    400: "#5086ef",
    500: "#3677f4",
    600: "#3571e5",
    700: "#2f84d3",
    800: "#285ec6",
    900: "#1c63b7",
    1000: "#123f74",
    1100: "#092042",
  },

  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    1000: "#000000",
  },
};

export const themeSettings = (): ThemeOptions => {
  return {
    palette: {
      primary: {
        ...colorTokens.mainColor,
        main: colorTokens.mainColor[600],
        light: colorTokens.grey[100],
        dark: colorTokens.grey[400],

        // coolColor: colorTokens.mainColor[600],
        gentelColor: colorTokens.mainColor[700],
        pureColor: colorTokens.mainColor[800],
        // darkColor: colorTokens.mainColor[900],
        intenseColor: colorTokens.mainColor[1000],
        fullDarkColor: colorTokens.mainColor[1100],
        neonColor: colorTokens.mainColor[1200],
      },
      secondary: {
        ...colorTokens.grey,
        main: colorTokens.mainColor[900],
        darkColor: colorTokens.mainColor[1000],

        darkGrey: colorTokens.grey[900],
        lightGrey: colorTokens.grey[300],

        softColor: colorTokens.mainColor[50],
        simpleColor: colorTokens.mainColor[100],
        lightColor: colorTokens.mainColor[200],
        warmColor: colorTokens.mainColor[300],
        mediumColor: colorTokens.mainColor[400],
        classicColor: colorTokens.mainColor[500],
      },
      background: {
        main: colorTokens.mainColor[700],
        light: colorTokens.grey[100],
      },
    },

    typography: {
      fontFamily: ["Roboto Condensed", "sans-serif"].join(","),
    },
  };
};
