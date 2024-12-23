import { ThemeOptions } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

interface customPaletteColors {
  darkmainColor?: string;
  lightmainColor?: string;
  clearmainColor?: string;
  normalmainColor?: string;
  simplemainColor?: string;
  fullDarkmainColor?: string;
  darkGrey?: string;
  lightGrey?: string;
  baseGray?: string;

  200?: string;
  500?: string;
  700?: string;
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
        clearmainColor: colorTokens.mainColor[100],
        lightmainColor: colorTokens.mainColor[200],
        normalmainColor: colorTokens.mainColor[400],
        simplemainColor: colorTokens.mainColor[500],
        fullDarkmainColor: colorTokens.mainColor[1100],
        light: colorTokens.grey[100],
        dark: colorTokens.grey[400],
      },
      secondary: {
        ...colorTokens.grey,
        main: colorTokens.mainColor[900],
        darkmainColor: colorTokens.mainColor[1000],
        lightmainColor: colorTokens.mainColor[300],
        lightGrey: colorTokens.grey[300],
        baseGray: colorTokens.grey[700],
        darkGrey: colorTokens.grey[900],
      },
      background: {
        main: colorTokens.mainColor[700],
      },
    },

    typography: {
      fontFamily: ["Roboto Condensed", "sans-serif"].join(","),
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: `
          /* Chrome, Safari, Edge, Opera */
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          input[type=number] {
            -moz-appearance: textfield;
          }
        `,
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            margin: "2px",
          },
        },
      },
    },
  };
};

const customBreakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    xxl: 1800,
  },
};

export const NewTheme = createTheme({
  breakpoints: customBreakpoints,
  ...themeSettings(),
});
