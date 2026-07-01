import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import About from '../pages/About'
import Cart from '../pages/Cart'
import Contact from '../pages/Contact'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import Login from '../pages/Login'
import MaterialDetails from '../pages/MaterialDetails'
import Materials from '../pages/Materials'
import Profile from '../pages/Profile'
import Register from '../pages/Register'
import WorkerDetails from '../pages/WorkerDetails'
import Workers from '../pages/Workers'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])

  return null
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="materials" element={<Materials />} />
          <Route path="materials/:id" element={<MaterialDetails />} />
          <Route path="workers" element={<Workers />} />
          <Route path="workers/:id" element={<WorkerDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
