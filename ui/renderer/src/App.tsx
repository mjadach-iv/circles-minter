import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useStore } from "./store";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/accounts";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";

function App() {

 // const getUiSecret = useStore((state) => state.getUiSecret);
  const loadDB = useStore((state) => state.loadDB);

  useEffect(() => {
    // getUiSecret();
    loadDB();
  }, [])

  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/accounts" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
