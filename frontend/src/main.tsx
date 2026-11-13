import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import VaultPage from './pages/VaultPage'
import ProtectedRoute from './components/ProtectedRoute'
import SessionGate from './components/SessionGate'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionGate>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/vault" element={<ProtectedRoute><VaultPage /></ProtectedRoute>} />
          </Routes>
        </SessionGate>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)