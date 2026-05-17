import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { StudioLandingPage } from './pages/StudioLandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { MapPage } from './pages/MapPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="studio" element={<StudioLandingPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="peta" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  )
}
