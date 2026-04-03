import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Toaster } from 'sonner';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-right"
      richColors          // makes success=green, error=red automatically
      expand={true}       // shows full message instead of collapsing
      duration={4000}     // disappears after 4 seconds
    />
    <App />
  </StrictMode>,
)
