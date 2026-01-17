//import "@/shared/wdyr";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { ThemeProvider, themeStorage } from "@/shared/theme";
import { I18nProvider, localeStorage } from "@/shared/i18n";
import { AppRestartProvider, appRestartService } from "@/features/app-restart";
import "@/shared/i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider storage={themeStorage}>
        <I18nProvider storage={localeStorage}>
          <AppRestartProvider service={appRestartService}>
            <App />
          </AppRestartProvider>
        </I18nProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
