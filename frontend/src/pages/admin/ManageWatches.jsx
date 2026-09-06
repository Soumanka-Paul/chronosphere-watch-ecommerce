
import { useEffect, useState } from 'react'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  Package,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '../../utils/axios.js'

export default function ManageWatches() {
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingWatch, setEditingWatch] = useState(null)

  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: 10,
    description: '',
    material: '',
    movement: '',
    waterResistance: '',
    caseDiameter: '',
    tag: '',
  })

  // =========================================================
  // FETCH WATCHES
  // =========================================================

  const fetchWatches = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/watches')

      setWatches(res.data?.watches || [])
    } catch (error) {
      console.error('Fetch watches error:', error)

      toast.error(
        error.response?.data?.message ||
          'Failed to load watches'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWatches()
  }, [])

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =========================================================
  // IMAGE SELECTION
  // =========================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    if (files.length > 5) {
      toast.error('You can upload maximum 5 images')
      return
    }

    const validImages = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        return false
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} must be less than 5MB`)
        return false
      }

      return true
    })

    setSelectedImages(validImages)

    const previews = validImages.map((file) =>
      URL.createObjectURL(file)
    )

    setImagePreviews(previews)
  }

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    imagePreviews.forEach((url) => {
      URL.revokeObjectURL(url)
    })

    setFormData({
      name: '',
      brand: '',
      category: '',
      price: '',
      discountPrice: '',
      stock: 10,
      description: '',
      material: '',
      movement: '',
      waterResistance: '',
      caseDiameter: '',
      tag: '',
    })

    setSelectedImages([])
    setImagePreviews([])
    setEditingWatch(null)
  }

  // =========================================================
  // OPEN CREATE MODAL
  // =========================================================

  const handleAddWatch = () => {
    resetForm()
    setShowModal(true)
  }

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const handleEditWatch = (watch) => {
    imagePreviews.forEach((url) => {
      URL.revokeObjectURL(url)
    })

    setEditingWatch(watch)

    setFormData({
      name: watch.name || '',
      brand: watch.brand || '',
      category: watch.category || '',
      price: watch.price ?? '',
      discountPrice: watch.discountPrice ?? '',
      stock: watch.stock ?? 0,
      description: watch.description || '',
      material: watch.specs?.material || '',
      movement: watch.specs?.movement || '',
      waterResistance: watch.specs?.waterResistance || '',
      caseDiameter: watch.specs?.caseDiameter || '',
      tag: watch.tag || '',
    })

    setSelectedImages([])
    setImagePreviews([])

    setShowModal(true)
  }

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseModal = () => {
    if (saving) return

    resetForm()
    setShowModal(false)
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (saving) return

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!formData.name.trim()) {
      toast.error('Watch name is required')
      return
    }

    if (!formData.brand.trim()) {
      toast.error('Brand is required')
      return
    }

    if (!formData.category.trim()) {
      toast.error('Category is required')
      return
    }

    // -------------------------------------------------------
    // PRICE
    // -------------------------------------------------------

    const price = Number(formData.price)

    if (!Number.isFinite(price) || price <= 0) {
      toast.error('Enter a valid price')
      return
    }

    // -------------------------------------------------------
    // DISCOUNT PRICE
    // -------------------------------------------------------

    let discountPrice = null

    if (
      formData.discountPrice !== '' &&
      formData.discountPrice !== null &&
      formData.discountPrice !== undefined
    ) {
      discountPrice = Number(formData.discountPrice)

      if (
        !Number.isFinite(discountPrice) ||
        discountPrice <= 0
      ) {
        toast.error('Enter a valid discount price')
        return
      }

      if (discountPrice >= price) {
        toast.error(
          'Discount price must be less than regular price'
        )
        return
      }
    }

    // -------------------------------------------------------
    // STOCK
    // -------------------------------------------------------

    const stock = Number(formData.stock)

    if (!Number.isInteger(stock) || stock < 0) {
      toast.error('Stock must be a valid non-negative integer')
      return
    }

    // -------------------------------------------------------
    // BUILD FORMDATA
    // -------------------------------------------------------

    const data = new FormData()

    data.append('name', formData.name.trim())
    data.append('brand', formData.brand.trim())
    data.append('category', formData.category.trim())
    data.append('price', String(price))

    // IMPORTANT:
    // Send empty string when there is no discount.
    // Backend should convert it to null.
    data.append(
      'discountPrice',
      discountPrice === null
        ? ''
        : String(discountPrice)
    )

    data.append('stock', String(stock))

    data.append(
      'description',
      formData.description.trim()
    )

    data.append('tag', formData.tag || '')

    // -------------------------------------------------------
    // SPECS
    // -------------------------------------------------------

    const specs = {
      material: formData.material.trim(),
      movement: formData.movement.trim(),
      waterResistance:
        formData.waterResistance.trim(),
      caseDiameter:
        formData.caseDiameter.trim(),
    }

    data.append('specs', JSON.stringify(specs))

    // -------------------------------------------------------
    // IMAGES
    // -------------------------------------------------------

    selectedImages.forEach((image) => {
      data.append('images', image)
    })

    // -------------------------------------------------------
    // API REQUEST
    // -------------------------------------------------------

    try {
      setSaving(true)

      let response

      if (editingWatch) {
        // UPDATE
        response = await axiosInstance.put(
          `/watches/${editingWatch._id}`,
          data
        )

        toast.success('Watch updated successfully')
      } else {
        // CREATE
        response = await axiosInstance.post(
          '/watches',
          data
        )

        toast.success('Watch created successfully')
      }

      console.log(
        'Watch API response:',
        response.data
      )

      // Refresh list
      await fetchWatches()

      // Close modal
      resetForm()
      setShowModal(false)
    } catch (error) {
      console.error(
        'Save watch error:',
        error
      )

      console.error(
        'Server response:',
        error.response?.data
      )

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to save watch'

      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // =========================================================
  // DELETE WATCH
  // =========================================================

  const handleDelete = async (watchId) => {
    if (deleting) return

    const confirmed = window.confirm(
      'Are you sure you want to delete this watch?'
    )

    if (!confirmed) return

    try {
      setDeleting(watchId)

      await axiosInstance.delete(
        `/watches/${watchId}`
      )

      toast.success('Watch deleted successfully')

      setWatches((prev) =>
        prev.filter(
          (watch) => watch._id !== watchId
        )
      )
    } catch (error) {
      console.error(
        'Delete watch error:',
        error
      )

      toast.error(
        error.response?.data?.message ||
          'Failed to delete watch'
      )
    } finally {
      setDeleting(null)
    }
  }

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredWatches = watches.filter((watch) => {
    const searchText = search
      .toLowerCase()
      .trim()

    if (!searchText) return true

    return (
      watch.name
        ?.toLowerCase()
        .includes(searchText) ||
      watch.brand
        ?.toLowerCase()
        .includes(searchText) ||
      watch.category
        ?.toLowerCase()
        .includes(searchText)
    )
  })

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0)
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                <Package size={16} />
                Admin Panel
                <span>/</span>
                Watches
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Manage Watches
              </h1>

              <p className="mt-2 text-gray-400">
                Add, edit and manage your watch collection.
              </p>
            </div>

            <button
              onClick={handleAddWatch}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:bg-gray-100"
            >
              <Plus size={19} />
              Add New Watch
            </button>

          </div>
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* SEARCH */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

          <div className="relative">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, brand or category..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-black focus:bg-white"
            />

          </div>
        </div>

        {/* =================================================
            WATCH GRID
        ================================================= */}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              )
            )}

          </div>
        ) : filteredWatches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">

            <Package
              size={45}
              className="mx-auto mb-4 text-gray-300"
            />

            <h3 className="text-xl font-semibold text-gray-800">
              No watches found
            </h3>

            <p className="mt-2 text-gray-500">
              Try another search or add a new watch.
            </p>

          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredWatches.map((watch) => {

              const image =
                watch.images?.[0]?.url

              const hasDiscount =
                watch.discountPrice !== null &&
                watch.discountPrice !== undefined &&
                Number(watch.discountPrice) <
                  Number(watch.price)

              return (
                <div
                  key={watch._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-square overflow-hidden bg-gray-100">

                    {image ? (
                      <img
                        src={image}
                        alt={watch.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <ImageIcon size={45} />
                      </div>
                    )}

                    {watch.tag && (
                      <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                        {watch.tag}
                      </span>
                    )}

                    {watch.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black">
                          Out of Stock
                        </span>
                      </div>
                    )}

                  </div>

                  {/* INFO */}

                  <div className="p-5">

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {watch.brand}
                    </p>

                    <h3 className="mt-1 truncate text-lg font-bold text-gray-900">
                      {watch.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {watch.category}
                    </p>

                    {/* PRICE */}

                    <div className="mt-4">

                      {hasDiscount ? (
                        <div className="flex items-center gap-2">

                          <span className="text-lg font-bold text-black">
                            {formatPrice(
                              watch.discountPrice
                            )}
                          </span>

                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(
                              watch.price
                            )}
                          </span>

                        </div>
                      ) : (
                        <span className="text-lg font-bold text-black">
                          {formatPrice(watch.price)}
                        </span>
                      )}

                    </div>

                    {/* STOCK */}

                    <div className="mt-3 text-sm">

                      {watch.stock > 0 ? (
                        <span className="text-gray-500">
                          Stock:{' '}
                          <span className="font-semibold text-gray-800">
                            {watch.stock}
                          </span>
                        </span>
                      ) : (
                        <span className="font-semibold text-red-500">
                          Out of stock
                        </span>
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-5 grid grid-cols-2 gap-2">

                      <button
                        onClick={() =>
                          handleEditWatch(watch)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(watch._id)
                        }
                        disabled={
                          deleting === watch._id
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deleting === watch._id ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}

                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              )
            })}

          </div>
        )}

      </div>

      {/* ===================================================
          MODAL
      =================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingWatch
                    ? 'Edit Watch'
                    : 'Add New Watch'}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingWatch
                    ? 'Update watch information'
                    : 'Add a new watch to your collection'}
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                disabled={saving}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-50"
              >
                <X size={22} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-7 p-6"
            >

              {/* BASIC INFORMATION */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
                  Basic Information
                </h3>

                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Watch Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Chronograph Classic"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Brand *
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="e.g. Rolex"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Category *
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Luxury / Sport / Dress"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Tag
                    </label>

                    <select
                      name="tag"
                      value={formData.tag}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
                    >
                      <option value="">
                        No Tag
                      </option>
                      <option value="Bestseller">
                        Bestseller
                      </option>
                      <option value="New">
                        New
                      </option>
                      <option value="Popular">
                        Popular
                      </option>
                      <option value="Limited">
                        Limited
                      </option>
                      <option value="Exclusive">
                        Exclusive
                      </option>
                    </select>
                  </div>

                </div>

              </div>

              {/* PRICING */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
                  Pricing & Stock
                </h3>

                <div className="grid gap-5 md:grid-cols-3">

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Regular Price *
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="185000"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Discount Price
                    </label>

                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="169999"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />

                    <p className="mt-1 text-xs text-gray-400">
                      Leave empty for no discount
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Stock *
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write a detailed description of the watch..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                />

              </div>

              {/* SPECS */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
                  Specifications
                </h3>

                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Material
                    </label>

                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      placeholder="Stainless Steel"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Movement
                    </label>

                    <input
                      type="text"
                      name="movement"
                      value={formData.movement}
                      onChange={handleChange}
                      placeholder="Automatic"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Water Resistance
                    </label>

                    <input
                      type="text"
                      name="waterResistance"
                      value={formData.waterResistance}
                      onChange={handleChange}
                      placeholder="100m"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Case Diameter
                    </label>

                    <input
                      type="text"
                      name="caseDiameter"
                      value={formData.caseDiameter}
                      onChange={handleChange}
                      placeholder="41mm"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                </div>

              </div>

              {/* IMAGES */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
                  Product Images
                </h3>

                {editingWatch &&
                  editingWatch.images?.length > 0 &&
                  selectedImages.length === 0 && (
                    <div className="mb-4">

                      <p className="mb-3 text-sm font-medium text-gray-600">
                        Current Images
                      </p>

                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">

                        {editingWatch.images.map(
                          (image, index) => (
                            <div
                              key={
                                image.publicId ||
                                index
                              }
                              className="aspect-square overflow-hidden rounded-xl border border-gray-200"
                            >
                              <img
                                src={image.url}
                                alt={`${editingWatch.name} ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-black hover:bg-white">

                  <Upload
                    size={30}
                    className="mb-3 text-gray-400"
                  />

                  <span className="font-semibold text-gray-700">
                    Click to upload images
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    Maximum 5 images, 5MB each
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

                {/* NEW PREVIEWS */}

                {imagePreviews.length > 0 && (
                  <div className="mt-4">

                    <p className="mb-3 text-sm font-medium text-gray-600">
                      New Images
                    </p>

                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">

                      {imagePreviews.map(
                        (preview, index) => (
                          <div
                            key={preview}
                            className="aspect-square overflow-hidden rounded-xl border border-gray-200"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )
                      )}

                    </div>

                    {editingWatch && (
                      <p className="mt-2 text-xs text-amber-600">
                        Uploading new images will replace the current images.
                      </p>
                    )}

                  </div>
                )}

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingWatch
                        ? 'Update Watch'
                        : 'Create Watch'}
                    </>
                  )}

                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

