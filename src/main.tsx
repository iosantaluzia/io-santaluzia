import { createRoot } from 'react-dom/client'
import './index.css'

// Detectar se está rodando no Electron
const isElectron = window.navigator.userAgent.includes('Electron') || 
                   (window as any).electronAPI !== undefined;

// Importar o App apropriado dinamicamente usando import() que funciona em ES modules
(async () => {
  const AppModule = isElectron 
    ? await import('./App.electron.tsx')
    : await import('./App.tsx');
  
  const App = AppModule.default;
  
  createRoot(document.getElementById("root")!).render(<App />);
})();
