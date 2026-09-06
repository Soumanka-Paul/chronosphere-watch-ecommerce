
import { Routes, Route, Outlet } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Shop from './pages/Shop'
import WatchDetail from './pages/WatchDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'

import AdminRoute from './pages/admin/AdminRoute'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ManageWatches from './pages/admin/ManageWatches'
import ManageOrders from './pages/admin/ManageOrders'
import ManageUsers from './pages/admin/ManageUsers'

function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full">
      <Navbar />

      <main className="flex-grow pt-16 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>

      {/* ================= CUSTOMER ROUTES ================= */}
      <Route element={<CustomerLayout />}>

        {/* Home - Public */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* ================= LOGIN REQUIRED ROUTES ================= */}

        <Route element={<ProtectedRoute />}>

          {/* Shop - Login Required */}
          <Route
            path="/shop"
            element={<Shop />}
          />

          {/* Watch Details - Login Required */}
          <Route
            path="/watches/:id"
            element={<WatchDetail />}
          />

        </Route>

        {/* ================= OTHER CUSTOMER ROUTES ================= */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* Authentication Pages */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

      </Route>

      {/* ================= RESET PASSWORD ================= */}

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      {/* ================= ADMIN ROUTES ================= */}

      <Route element={<AdminRoute />}>

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="watches"
            element={<ManageWatches />}
          />

          <Route
            path="orders"
            element={<ManageOrders />}
          />

          <Route
            path="users"
            element={<ManageUsers />}
          />

        </Route>

      </Route>

    </Routes>
  )
}

export default App

