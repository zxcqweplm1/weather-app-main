import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './routes/routes'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename="/weather-app-main/">
  <StrictMode>
    <AppRouter />
  </StrictMode>
    </BrowserRouter>
)
