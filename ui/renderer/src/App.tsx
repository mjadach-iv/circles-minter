import { useEffect } from "react";
import {
  Route,
  Routes,
} from "react-router-dom";
import { useStore } from "./store";
import IndexPage from "./pages/index";
import AccountsPage from "./pages/accounts";

function App() {
  const loadDB = useStore((state) => state.loadDB);

  useEffect(() => {
    loadDB();
  }, [])

  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<AccountsPage />} path="/accounts" />
    </Routes>
  );
}

export default App;
