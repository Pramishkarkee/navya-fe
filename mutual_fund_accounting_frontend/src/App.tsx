import React, { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { themeSettings } from "./theme.tsx";
import MainRoutes from "./routes/MainRoutes";
import { ErrorProvider } from "./context/ErrorContext.tsx";
import GlobalError from "components/GlobalError/GlobalError.tsx";

function App() {
  const theme = useMemo(() => createTheme(themeSettings()), []);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <React.Fragment>
      <ErrorProvider>
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
      </ErrorProvider>
    </React.Fragment>
  );
}

export default App;
