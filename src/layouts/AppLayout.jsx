import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function AppLayout() {
  return (
    <>
      <main className="grid min-h-screen place-items-center bg-white px-4 text-neutral-950">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </>
  )
}

export default AppLayout
