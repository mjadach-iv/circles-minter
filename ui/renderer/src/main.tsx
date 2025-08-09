import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HeroUIProvider } from '@heroui/react'
import { HashRouter } from "react-router-dom";
import Watcher from "./components/watcher";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <HeroUIProvider>
        <main className="dark text-foreground bg-background">
          <App />
        </main>
        <Watcher />
      </HeroUIProvider>
    </HashRouter>
  </StrictMode>,
)
