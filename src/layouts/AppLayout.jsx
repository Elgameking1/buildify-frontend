import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Toast from '../components/ui/Toast'

function AppLayout() {
  return (
    <>
      <div className="app-shell flex min-h-screen flex-col">
        <Navbar />
        <main className="grid flex-1 place-items-center px-4 py-10">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toast />
    </>
  )
}

export default AppLayout
