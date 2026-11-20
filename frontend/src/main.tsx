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
import SettingsPage from './pages/SettingsPage'
import ErrorPage from './pages/ErrorPage'
import ErrorBoundary from './components/ErrorBoundary'
import FeaturesPage from './pages/FeaturesPage'
import SecurityPage from './pages/SecurityPage'
import TermsPage from './pages/TermsPage'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <SessionGate>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/vault" element={<ProtectedRoute><VaultPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </SessionGate>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)