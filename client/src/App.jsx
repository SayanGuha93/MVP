import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import DeveloperProfile from "./pages/DeveloperProfile";
import AI_Help from "./pages/AI_Help";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/developer/:developer_id" element={<DeveloperProfile />} />
        <Route path="/developer/:developer_id/ai-help" element={<AI_Help />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;