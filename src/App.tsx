import { Routes, Route } from "react-router";
import { PageContainer } from "./layouts";
import { Home } from "./pages/Home";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageContainer />}>
        <Route index element={<Home />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
