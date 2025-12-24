import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"

import MainLayout from "./layout/MainLayout"
import DashboardLayout from "./layout/DashboardLayout"

import Home from "./pages/Home"
import Login from "./pages/Login"
import SignupPage from "./pages/SignupPage"
import AdminDashboard from "./pages/AdminDashboard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 PUBLIC SITE */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* 🧑‍💼 DASHBOARD */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
