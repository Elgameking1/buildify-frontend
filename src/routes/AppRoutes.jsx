import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <h1 className="text-3xl font-semibold">Online Marketplace</h1>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
