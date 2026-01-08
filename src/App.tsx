import { Routes, Route } from "react-router";
import { PageContainer } from "@/shared/layouts";
import { HomePage } from "./pages/HomePage";
import { ComponentShowcasePage } from "./pages/ComponentShowcasePage";
import { SettingsPage } from "./pages/SettingsPage";
import { LogsPage } from "./pages/LogsPage";
import { RestartPrompt } from "@/features/app-restart";

function App() {
  return (
    <>
      {/* Global restart prompt overlay */}
      <RestartPrompt />
      
      <Routes>
        <Route path="/" element={<PageContainer />}>
          <Route index element={<HomePage />} />
          <Route path="showcase" element={<ComponentShowcasePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
