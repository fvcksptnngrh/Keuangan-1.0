import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import PageTransition from './PageTransition'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-sidebar">
      <Sidebar />
      <main className="flex-1 ml-[260px] bg-main min-h-screen p-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  )
}

export default MainLayout
