import { useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, GlobalStyles } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./routes/MainRoutes";
import { themeSettings, NewTheme } from "./theme.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { deepmerge } from "@mui/utils";
import { ErrorProvider } from "./context/ErrorContextProvider.tsx";
import GlobalError from "components/GlobalError/GlobalError.tsx";

function App() {
  const customTheme = deepmerge(themeSettings(), NewTheme);
  const theme = useMemo(() => createTheme(customTheme), [customTheme]);
  // const theme = useMemo(() => createTheme(themeSettings()), []);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <ErrorProvider>
      <Box>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalStyles
                styles={{
                  "@global": {
                    "html, body, #root": {
                      height: "100%",
                      width: "100%",
                    },
                  },
                }}
              />
              <MainRoutes />
              <GlobalError />
            </ThemeProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </Box>
    </ErrorProvider>
  );
}

export default App;
// import { useMemo } from "react";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Box, CssBaseline, GlobalStyles } from "@mui/material";
// import { BrowserRouter } from "react-router-dom";
// import MainRoutes from "./routes/MainRoutes";
// import { themeSettings , mytheme } from "./theme.tsx";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// function App() {
// const theme = useMemo(() => createTheme(themeSettings()), []);
//   const queryClient = new QueryClient({
//     defaultOptions: {
//       queries: {
//         refetchOnWindowFocus: false,
//       },
//     },
//   });

//   return (
//     <Box>
//       <BrowserRouter>
//         <QueryClientProvider client={queryClient}>
//           <ThemeProvider theme={theme}>
//             <CssBaseline />
//             <GlobalStyles
//               styles={{
//                 "@global": {
//                   "html, body, #root": {
//                     height: "100%",
//                     width: "100%",
//                   },
//                 },
//               }}
//             />
//             <MainRoutes />
//           </ThemeProvider>
//         </QueryClientProvider>
//       </BrowserRouter>
//     </Box>
//   );
// }

// export default App;
