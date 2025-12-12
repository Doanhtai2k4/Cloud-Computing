import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/theme.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import 'antd/dist/reset.css';



createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <StrictMode>
        <App />
        <Toaster />
      </StrictMode>
    </AuthProvider>
  </ThemeProvider>
)