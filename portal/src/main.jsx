import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppearanceProvider } from './context/AppearanceContext'
import { PortalDataProvider } from './context/PortalDataContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppearanceProvider>
        <PortalDataProvider>
          <App />
          <Toaster position="top-right" />
        </PortalDataProvider>
      </AppearanceProvider>
    </BrowserRouter>
  </StrictMode>
)
