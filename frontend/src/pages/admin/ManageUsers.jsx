
import { useEffect, useState } from 'react'
import {
  Users,
  Search,
  Trash2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  User,
  CalendarDays,
} from 'lucide-react'
import toast from 'react-hot-toast'

import axiosInstance from '../../utils/axios'
import { useAuth } from '../../context/AuthContext'

export default function ManageUsers() {
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  // ============================================
  // FETCH USERS
  // ============================================

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/admin/users')

      setUsers(res.data.users || [])
    } catch (error) {
      console.error('Fetch users error:', error)

      toast.error(
        error.response?.data?.message ||
        'Failed to load users'
      )
    } finally {
      setLoading(false)
    }
  }


  // ============================================
  // DELETE USER
  // ============================================

  const handleDelete = async (user) => {
    if (user._id === currentUser?._id) {
      toast.error('You cannot delete your own account')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`
    )

    if (!confirmed) return

    try {
      setDeletingId(user._id)

      const res = await axiosInstance.delete(
        `/admin/users/${user._id}`
      )

      setUsers((prevUsers) =>
        prevUsers.filter(
          (item) => item._id !== user._id
        )
      )

      toast.success(
        res.data.message ||
        'User deleted successfully'
      )
    } catch (error) {
      console.error('Delete user error:', error)

      toast.error(
        error.response?.data?.message ||
        'Failed to delete user'
      )
    } finally {
      setDeletingId(null)
    }
  }


  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }


  // ============================================
  // SEARCH USERS
  // ============================================

  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase().trim()

    return (
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.role?.toLowerCase().includes(searchTerm)
    )
  })


  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="
        min-h-[60vh]
        flex
        items-center
        justify-center
      ">

        <div className="
          flex
          flex-col
          items-center
          gap-3
        ">

          <Loader2
            size={32}
            className="animate-spin text-black"
          />

          <p className="text-sm text-gray-500">
            Loading users...
          </p>

        </div>

      </div>
    )
  }


  return (
    <div className="space-y-6">

      {/* ========================================
          HEADER
          ======================================== */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
      ">

        <div>

          <p className="
            text-sm
            text-gray-400
            mb-1
          ">
            User Management
          </p>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-gray-900
            "
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Manage Users
          </h1>

          <p className="
            text-sm
            text-gray-500
            mt-2
          ">
            View and manage registered users.
          </p>

        </div>


        <button
          onClick={fetchUsers}
          className="
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            border
            border-gray-200
            rounded-xl
            text-sm
            font-medium
            text-gray-700
            hover:bg-gray-100
            transition
          "
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      {/* ========================================
          SUMMARY
          ======================================== */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-4
      ">

        {/* Total Users */}

        <div className="
          bg-white
          border
          border-gray-100
          rounded-2xl
          p-5
          shadow-sm
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-gray-100
              flex
              items-center
              justify-center
            ">
              <Users
                size={20}
                className="text-gray-700"
              />
            </div>

            <div>

              <p className="
                text-xs
                text-gray-400
                uppercase
                tracking-wider
              ">
                Total Users
              </p>

              <p className="
                text-2xl
                font-bold
                text-gray-900
                mt-1
              ">
                {users.length}
              </p>

            </div>

          </div>

        </div>


        {/* Customers */}

        <div className="
          bg-white
          border
          border-gray-100
          rounded-2xl
          p-5
          shadow-sm
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-blue-50
              flex
              items-center
              justify-center
            ">
              <User
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>

              <p className="
                text-xs
                text-gray-400
                uppercase
                tracking-wider
              ">
                Customers
              </p>

              <p className="
                text-2xl
                font-bold
                text-gray-900
                mt-1
              ">
                {
                  users.filter(
                    (user) => user.role !== 'admin'
                  ).length
                }
              </p>

            </div>

          </div>

        </div>


        {/* Admins */}

        <div className="
          bg-white
          border
          border-gray-100
          rounded-2xl
          p-5
          shadow-sm
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-purple-50
              flex
              items-center
              justify-center
            ">
              <ShieldCheck
                size={20}
                className="text-purple-600"
              />
            </div>

            <div>

              <p className="
                text-xs
                text-gray-400
                uppercase
                tracking-wider
              ">
                Administrators
              </p>

              <p className="
                text-2xl
                font-bold
                text-gray-900
                mt-1
              ">
                {
                  users.filter(
                    (user) => user.role === 'admin'
                  ).length
                }
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          SEARCH
          ======================================== */}

      <div className="
        bg-white
        border
        border-gray-100
        rounded-2xl
        p-4
        shadow-sm
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
      ">

        <div className="
          relative
          w-full
          sm:max-w-md
        ">

          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name or email..."
            className="
              w-full
              pl-10
              pr-4
              py-2.5
              border
              border-gray-200
              rounded-xl
              text-sm
              outline-none
              focus:border-black
              transition
            "
          />

        </div>


        <p className="text-sm text-gray-500">

          Showing{' '}

          <span className="
            font-semibold
            text-gray-900
          ">
            {filteredUsers.length}
          </span>

          {' '}of{' '}

          <span className="
            font-semibold
            text-gray-900
          ">
            {users.length}
          </span>

          {' '}users

        </p>

      </div>


      {/* ========================================
          USERS TABLE
          ======================================== */}

      <div className="
        bg-white
        border
        border-gray-100
        rounded-2xl
        shadow-sm
        overflow-hidden
      ">

        {filteredUsers.length === 0 ? (

          <div className="
            py-16
            text-center
          ">

            <Users
              size={42}
              className="
                mx-auto
                text-gray-300
              "
            />

            <h3 className="
              text-lg
              font-semibold
              text-gray-900
              mt-4
            ">
              No users found
            </h3>

            <p className="
              text-sm
              text-gray-500
              mt-1
            ">
              Try changing your search.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="
              w-full
              min-w-[800px]
            ">

              <thead>

                <tr className="
                  border-b
                  border-gray-100
                  bg-gray-50/50
                ">

                  <th className="
                    text-left
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    text-gray-400
                    uppercase
                    tracking-wider
                  ">
                    User
                  </th>

                  <th className="
                    text-left
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    text-gray-400
                    uppercase
                    tracking-wider
                  ">
                    Role
                  </th>

                  <th className="
                    text-left
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    text-gray-400
                    uppercase
                    tracking-wider
                  ">
                    Joined
                  </th>

                  <th className="
                    text-right
                    px-5
                    py-4
                    text-xs
                    font-semibold
                    text-gray-400
                    uppercase
                    tracking-wider
                  ">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.map((user) => {

                  const isCurrentUser =
                    user._id === currentUser?._id

                  const isAdmin =
                    user.role === 'admin'

                  return (
                    <tr
                      key={user._id}
                      className="
                        border-b
                        border-gray-50
                        last:border-0
                        hover:bg-gray-50
                        transition
                      "
                    >

                      {/* USER */}
                      <td className="px-5 py-4">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <div className={`
                            w-10
                            h-10
                            rounded-full
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            ${
                              isAdmin
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-600'
                            }
                          `}>

                            {isAdmin ? (
                              <ShieldCheck size={18} />
                            ) : (
                              <User size={18} />
                            )}

                          </div>


                          <div>

                            <div className="
                              flex
                              items-center
                              gap-2
                            ">

                              <p className="
                                text-sm
                                font-semibold
                                text-gray-900
                              ">
                                {user.name}
                              </p>

                              {isCurrentUser && (
                                <span className="
                                  px-2
                                  py-0.5
                                  rounded-full
                                  bg-gray-100
                                  text-gray-500
                                  text-[10px]
                                  font-medium
                                ">
                                  You
                                </span>
                              )}

                            </div>

                            <p className="
                              text-xs
                              text-gray-400
                              mt-0.5
                            ">
                              {user.email}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* ROLE */}
                      <td className="px-5 py-4">

                        <span className={`
                          inline-flex
                          items-center
                          gap-1.5
                          px-2.5
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${
                            isAdmin
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-700'
                          }
                        `}>

                          {isAdmin && (
                            <ShieldCheck size={13} />
                          )}

                          {isAdmin
                            ? 'Administrator'
                            : 'Customer'}

                        </span>

                      </td>


                      {/* JOINED */}
                      <td className="px-5 py-4">

                        <div className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-gray-500
                        ">

                          <CalendarDays size={15} />

                          {formatDate(
                            user.createdAt
                          )}

                        </div>

                      </td>


                      {/* ACTIONS */}
                      <td className="px-5 py-4">

                        <div className="
                          flex
                          items-center
                          justify-end
                        ">

                          <button
                            onClick={() =>
                              handleDelete(user)
                            }
                            disabled={
                              isCurrentUser ||
                              deletingId === user._id
                            }
                            className="
                              w-9
                              h-9
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              border
                              border-gray-200
                              text-gray-500
                              hover:bg-red-50
                              hover:text-red-600
                              hover:border-red-100
                              transition
                              disabled:opacity-30
                              disabled:cursor-not-allowed
                            "
                            title={
                              isCurrentUser
                                ? 'You cannot delete yourself'
                                : 'Delete user'
                            }
                          >

                            {deletingId === user._id ? (

                              <Loader2
                                size={16}
                                className="animate-spin"
                              />

                            ) : (

                              <Trash2 size={16} />

                            )}

                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}

