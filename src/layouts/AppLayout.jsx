import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function AppLayout() {
  return (
    <>
      <main className="app-shell grid place-items-center px-4">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </>
  )
}

export default AppLayout
