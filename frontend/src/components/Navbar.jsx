import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Clock,
  User,
  Menu,
  X,
  Heart,
} from 'lucide-react'

import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = useNavigate()

  const { totalItems } = useCart()
  const { isLoggedIn, logout, isAdmin } = useAuth()

  const handleLogout = async () => {
    await logout()

    localStorage.removeItem('token')

    setMenuOpen(false)

    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-black transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>

          <div className="flex flex-col leading-none">
            <span
              className="text-[21px] sm:text-2xl font-semibold tracking-tight text-gray-950"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ChronoSphere
            </span>

            <span className="hidden sm:block text-[8px] tracking-[0.32em] uppercase text-gray-400 mt-1">
              Timeless Elegance
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative px-4 py-2 text-sm font-medium transition-colors duration-300 group ${
                isActive
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Home
                <span
                  className={`absolute bottom-0 left-4 right-4 h-[1.5px] bg-black transition-transform duration-300 origin-center ${
                    isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </>
            )}
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `relative px-4 py-2 text-sm font-medium transition-colors duration-300 group ${
                isActive
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Shop
                <span
                  className={`absolute bottom-0 left-4 right-4 h-[1.5px] bg-black transition-transform duration-300 origin-center ${
                    isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </>
            )}
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `relative px-4 py-2 text-sm font-medium transition-colors duration-300 group ${
                isActive
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Wishlist
                <span
                  className={`absolute bottom-0 left-4 right-4 h-[1.5px] bg-black transition-transform duration-300 origin-center ${
                    isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </>
            )}
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `relative px-4 py-2 text-sm font-medium transition-colors duration-300 group ${
                isActive
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`
            }
          >
            {({ isActive }) => (
              <>
                Orders
                <span
                  className={`absolute bottom-0 left-4 right-4 h-[1.5px] bg-black transition-transform duration-300 origin-center ${
                    isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </>
            )}
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `ml-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                  isActive
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-600 hover:text-white'
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`
            }
          >
            <ShoppingBag className="h-[19px] w-[19px]" />

            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-black text-white text-[9px] font-semibold rounded-full min-w-[17px] h-[17px] px-1 flex items-center justify-center ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-gray-100 text-red-500'
                  : 'text-gray-600 hover:text-red-500 hover:bg-gray-100'
              }`
            }
          >
            <Heart className="h-[19px] w-[19px]" />
          </NavLink>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 border border-gray-200 bg-white text-gray-700 text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-gray-100 hover:border-gray-300 transition-all duration-300"
            >
              <User className="h-4 w-4" />
              Logout
            </button>
          )}

          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:bg-gray-100 transition-all duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-5 shadow-xl">
          <div className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center py-3.5 px-4 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center py-3.5 px-4 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between py-3.5 px-4 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`
              }
            >
              Wishlist
              <Heart className="h-4 w-4" />
            </NavLink>

            <NavLink
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center py-3.5 px-4 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`
              }
            >
              Orders
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center py-3.5 px-4 text-sm font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                  }`
                }
              >
                Admin Dashboard
              </NavLink>
            )}
          </div>

          {!isLoggedIn ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold px-4 py-3.5 rounded-full mt-4 hover:bg-gray-800 transition-all"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-3.5 rounded-full mt-4 hover:bg-gray-100 transition-all"
            >
              <User className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  )
}