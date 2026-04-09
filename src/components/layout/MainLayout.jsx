import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar, { MobileMenuButton } from './Sidebar'
import PageTransition from './PageTransition'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-sidebar">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileMenuButton onClick={() => setSidebarOpen(true)} />
      <main className="flex-1 lg:ml-[260px] bg-main min-h-screen p-4 pt-16 sm:p-6 sm:pt-16 lg:p-8 lg:pt-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  )
}

export default MainLayout
