import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { ThemeProvider } from "@/common/theme";
import { configThemeStorage, configLocaleStorage } from "@/features/configuration";
import { I18nProvider } from "@/common/i18n";
import "@/common/i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider storage={configThemeStorage}>
        <I18nProvider storage={configLocaleStorage}>
          <App />
        </I18nProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
