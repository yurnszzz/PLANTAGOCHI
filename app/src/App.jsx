import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DemoPage from './pages/DemoPage'
import PricingPage from './pages/PricingPage'
import LoginPage from './pages/LoginPage'
import LeaderboardPage from './pages/LeaderboardPage'
import GardenPage from './pages/GardenPage'
import PlantPage from './plant/PlantPage'
import PlantOnboarding from './plant/PlantOnboarding'
import AdminLayout from './admin/AdminLayout'
import DashboardPage from './admin/DashboardPage'
import PlantsManager from './admin/PlantsManager'
import UsersManager from './admin/UsersManager'
import SettingsPage from './admin/SettingsPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* ===== Web Portal ===== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/garden" element={<GardenPage />} />

      {/* ===== User App (Digital Twin) ===== */}
      <Route path="/p/:token" element={<PlantPage />} />
      <Route path="/p/:token/setup" element={<PlantOnboarding />} />

      {/* ===== Admin Dashboard ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="plants" element={<PlantsManager />} />
        <Route path="users" element={<UsersManager />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App
