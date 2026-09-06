import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Watch,
  ShoppingBag,
  Users,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Manage Watches',
      path: '/admin/watches',
      icon: Watch,
    },
    {
      name: 'Manage Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Manage Users',
      path: '/admin/users',
      icon: Users,
    },
  ]

  const handleLogout = async () => {
    await logout()
    setSidebarOpen(false)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleBackToStore = () => {
    setSidebarOpen(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-64
          h-screen
          bg-black
          text-white
          flex
          flex-col
          transition-transform
          duration-300
          ${sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
          }
        `}
      >

        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">

          <div>
            <h1
              className="text-xl font-bold tracking-wide"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              ChronoSphere
            </h1>

            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1">
              Admin Panel
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">

          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  text-sm
                  transition-all
                  ${
                    isActive
                      ? 'bg-white text-black font-semibold'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }
                  `
                }
              >
                <Icon size={18} />

                <span>
                  {item.name}
                </span>
              </NavLink>
            )
          })}

        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">

          <button
            onClick={handleBackToStore}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-sm
              text-gray-400
              hover:bg-white/10
              hover:text-white
              transition
            "
          >
            <ArrowLeft size={18} />

            <span>
              Back to Store
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              text-sm
              text-gray-400
              hover:bg-red-500/10
              hover:text-red-400
              transition
            "
          >
            <LogOut size={18} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      <div className="lg:ml-64 min-h-screen">

        <header
          className="
            h-20
            bg-white
            border-b border-gray-100
            px-4 sm:px-6 lg:px-8
            flex items-center justify-between
          "
        >

          <button
            onClick={() => setSidebarOpen(true)}
            className="
              lg:hidden
              p-2
              rounded-lg
              hover:bg-gray-100
              transition
            "
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:block">

            <p className="text-xs text-gray-400 uppercase tracking-wider">
              ChronoSphere
            </p>

            <h2 className="text-lg font-semibold text-gray-900">
              Administration
            </h2>

          </div>

          <div className="ml-auto flex items-center gap-3">

            <div
              className="
                w-9 h-9
                rounded-full
                bg-black
                text-white
                flex items-center justify-center
              "
            >
              <span className="text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-semibold text-gray-900">
                {user?.name || 'Administrator'}
              </p>

              <p className="text-xs text-gray-400">
                Administrator
              </p>

            </div>

          </div>

        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  )
}