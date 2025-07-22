import { useEffect } from "react";
import {
  Route,
  Routes,
} from "react-router-dom";
import { useStore } from "./store";
import IndexPage from "./pages/index";
import AccountsPage from "./pages/accounts";
import SettingsPage from "./pages/settings";

function App() {
  const loadDB = useStore((state) => state.loadDB);

  useEffect(() => {
    loadDB();
  }, [])

  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<AccountsPage />} path="/accounts" />
      <Route element={<AccountsPage />} path="/settings" />
    </Routes>
  );
}

export default App;
