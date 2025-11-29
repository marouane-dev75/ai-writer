import { Routes, Route } from "react-router";
import { PageContainer } from "./layouts";
import { HomePage } from "./pages/HomePage";
import { ComponentShowcasePage } from "./pages/ComponentShowcasePage";
import { SettingsPage } from "./pages/SettingsPage";
import { LogsPage } from "./pages/LogsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageContainer />}>
        <Route index element={<HomePage />} />
        <Route path="showcase" element={<ComponentShowcasePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="logs" element={<LogsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
