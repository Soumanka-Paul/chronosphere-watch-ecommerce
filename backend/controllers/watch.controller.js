
import Watch from '../models/watch.model.js'
import {
  uploadImage,
  deleteImage,
} from '../utils/cloudinaryUpload.js'

// ==============================
// GET ALL WATCHES
// ==============================
export const getAllWatches = async (req, res) => {
  try {
    const { brand, search } = req.query

    const filter = {}

    if (brand) {
      filter.brand = brand
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: 'i',
      }
    }

    const watches = await Watch.find(filter).sort({
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      count: watches.length,
      watches,
    })
  } catch (error) {
    console.error('Get all watches error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch watches',
    })
  }
}

// ==============================
// GET SINGLE WATCH
// ==============================
export const getWatchById = async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id)

    if (!watch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found',
      })
    }

    res.status(200).json({
      success: true,
      watch,
    })
  } catch (error) {
    console.error('Get watch by ID error:', error)

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid watch ID',
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch watch',
    })
  }
}

// ==============================
// CREATE WATCH
// ==============================
export const createWatch = async (req, res) => {
  const uploadedImages = []

  try {
    const {
      name,
      brand,
      price,
      discountPrice,
      description,
      category,
      stock,
      specs,
      tag,
    } = req.body

    // ------------------------------
    // BASIC VALIDATION
    // ------------------------------

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Watch name is required',
      })
    }

    if (!brand?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Brand is required',
      })
    }

    if (price === undefined || price === '') {
      return res.status(400).json({
        success: false,
        message: 'Price is required',
      })
    }

    // ------------------------------
    // PRICE
    // ------------------------------

    const numericPrice = Number(price)

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0',
      })
    }

    // ------------------------------
    // DISCOUNT PRICE
    // ------------------------------

    let numericDiscountPrice = null

    if (
      discountPrice !== undefined &&
      discountPrice !== ''
    ) {
      numericDiscountPrice = Number(discountPrice)

      if (
        !Number.isFinite(numericDiscountPrice) ||
        numericDiscountPrice <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Discount price must be greater than 0',
        })
      }

      if (
        numericDiscountPrice >= numericPrice
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Discount price must be less than regular price',
        })
      }
    }

    // ------------------------------
    // STOCK
    // ------------------------------

    const numericStock =
      stock === undefined || stock === ''
        ? 10
        : Number(stock)

    if (
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Stock must be a valid non-negative integer',
      })
    }

    // ------------------------------
    // TAG
    // ------------------------------

    const allowedTags = [
      'Bestseller',
      'New',
      'Popular',
      'Limited',
      'Exclusive',
    ]

    let finalTag = null

    if (tag && tag !== '') {
      if (!allowedTags.includes(tag)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid watch tag',
        })
      }

      finalTag = tag
    }

    // ------------------------------
    // IMAGES
    // ------------------------------

    if (
      req.files &&
      req.files.length > 5
    ) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 images are allowed',
      })
    }

    // ------------------------------
    // SPECS
    // ------------------------------

    let parsedSpecs = {}

    if (specs) {
      try {
        parsedSpecs =
          typeof specs === 'string'
            ? JSON.parse(specs)
            : specs
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid specs format',
        })
      }
    }

    if (
      typeof parsedSpecs !== 'object' ||
      Array.isArray(parsedSpecs)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Specs must be an object',
      })
    }

    // ------------------------------
    // UPLOAD IMAGES
    // ------------------------------

    if (
      req.files &&
      req.files.length > 0
    ) {
      for (const file of req.files) {
        const uploaded =
          await uploadImage(file.buffer)

        uploadedImages.push(uploaded)
      }
    }

    // ------------------------------
    // CREATE WATCH
    // ------------------------------

    const watch = await Watch.create({
      name: name.trim(),
      brand: brand.trim(),
      price: numericPrice,
      discountPrice: numericDiscountPrice,
      description:
        description?.trim() || '',
      category:
        category?.trim() || 'Luxury',
      stock: numericStock,
      specs: parsedSpecs,
      tag: finalTag,
      images: uploadedImages,
    })

    res.status(201).json({
      success: true,
      message: 'Watch created successfully',
      watch,
    })
  } catch (error) {
    console.error(
      'Create watch error:',
      error
    )

    // Cleanup Cloudinary uploads
    for (const image of uploadedImages) {
      if (image.publicId) {
        try {
          await deleteImage(
            image.publicId
          )
        } catch (deleteError) {
          console.error(
            'Failed to cleanup uploaded image:',
            deleteError
          )
        }
      }
    }

    // Mongoose validation error
    if (
      error.name ===
      'ValidationError'
    ) {
      return res.status(400).json({
        success: false,
        message: Object.values(
          error.errors
        )
          .map(
            (err) => err.message
          )
          .join(', '),
      })
    }

    res.status(500).json({
      success: false,
      message:
        error.message ||
        'Failed to create watch',
    })
  }
}

// ==============================
// UPDATE WATCH
// ==============================
export const updateWatch = async (req, res) => {
  const newUploadedImages = []

  try {
    // ------------------------------
    // FIND EXISTING WATCH
    // ------------------------------

    const watch =
      await Watch.findById(
        req.params.id
      )

    if (!watch) {
      return res.status(404).json({
        success: false,
        message: 'Watch not found',
      })
    }

    const {
      name,
      brand,
      price,
      discountPrice,
      description,
      category,
      stock,
      specs,
      tag,
    } = req.body

    const updateData = {}

    // ========================================================
    // NAME
    // ========================================================

    if (name !== undefined) {
      const trimmedName =
        String(name).trim()

      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message:
            'Watch name cannot be empty',
        })
      }

      updateData.name =
        trimmedName
    }

    // ========================================================
    // BRAND
    // ========================================================

    if (brand !== undefined) {
      const trimmedBrand =
        String(brand).trim()

      if (!trimmedBrand) {
        return res.status(400).json({
          success: false,
          message:
            'Brand cannot be empty',
        })
      }

      updateData.brand =
        trimmedBrand
    }

    // ========================================================
    // PRICE
    // ========================================================

    let finalPrice =
      Number(watch.price)

    if (
      price !== undefined &&
      price !== ''
    ) {
      const numericPrice =
        Number(price)

      if (
        !Number.isFinite(
          numericPrice
        ) ||
        numericPrice <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Price must be greater than 0',
        })
      }

      finalPrice =
        numericPrice

      updateData.price =
        numericPrice
    }

    // ========================================================
    // DISCOUNT PRICE
    // ========================================================

    let finalDiscountPrice =
      watch.discountPrice

    if (
      discountPrice !== undefined
    ) {
      // User removed discount
      if (discountPrice === '') {
        finalDiscountPrice = null

        updateData.discountPrice =
          null
      } else {
        const numericDiscountPrice =
          Number(discountPrice)

        if (
          !Number.isFinite(
            numericDiscountPrice
          ) ||
          numericDiscountPrice <= 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              'Discount price must be greater than 0',
          })
        }

        if (
          numericDiscountPrice >=
          finalPrice
        ) {
          return res.status(400).json({
            success: false,
            message:
              'Discount price must be less than regular price',
          })
        }

        finalDiscountPrice =
          numericDiscountPrice

        updateData.discountPrice =
          numericDiscountPrice
      }
    }

    // ========================================================
    // IMPORTANT PRICE/DISCOUNT SAFETY CHECK
    // ========================================================

    if (
      finalDiscountPrice !== null &&
      finalDiscountPrice !== undefined &&
      Number(finalDiscountPrice) >=
        Number(finalPrice)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Discount price must be less than regular price',
      })
    }

    // ========================================================
    // DESCRIPTION
    // ========================================================

    if (
      description !== undefined
    ) {
      updateData.description =
        String(description).trim()
    }

    // ========================================================
    // CATEGORY
    // ========================================================

    if (
      category !== undefined
    ) {
      updateData.category =
        String(category).trim() ||
        'Luxury'
    }

    // ========================================================
    // STOCK
    // ========================================================

    if (
      stock !== undefined &&
      stock !== ''
    ) {
      const numericStock =
        Number(stock)

      if (
        !Number.isInteger(
          numericStock
        ) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Stock must be a valid non-negative integer',
        })
      }

      updateData.stock =
        numericStock
    }

    // ========================================================
    // TAG
    // ========================================================

    if (
      tag !== undefined
    ) {
      const allowedTags = [
        'Bestseller',
        'New',
        'Popular',
        'Limited',
        'Exclusive',
      ]

      if (
        tag !== '' &&
        !allowedTags.includes(tag)
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid watch tag',
        })
      }

      updateData.tag =
        tag || null
    }

    // ========================================================
    // SPECS
    // ========================================================

    if (
      specs !== undefined
    ) {
      let parsedSpecs

      try {
        parsedSpecs =
          typeof specs === 'string'
            ? JSON.parse(specs)
            : specs
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid specs format',
        })
      }

      if (
        typeof parsedSpecs !==
          'object' ||
        parsedSpecs === null ||
        Array.isArray(
          parsedSpecs
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Specs must be an object',
        })
      }

      updateData.specs =
        parsedSpecs
    }

    // ========================================================
    // IMAGE VALIDATION
    // ========================================================

    if (
      req.files &&
      req.files.length > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Maximum 5 images are allowed',
      })
    }

    // ========================================================
    // UPLOAD NEW IMAGES
    // ========================================================

    if (
      req.files &&
      req.files.length > 0
    ) {
      for (const file of req.files) {
        const uploaded =
          await uploadImage(
            file.buffer
          )

        newUploadedImages.push(
          uploaded
        )
      }

      // New images replace old images
      updateData.images =
        newUploadedImages
    }

    // ========================================================
    // UPDATE DATABASE
    // ========================================================

    const updatedWatch =
      await Watch.findByIdAndUpdate(
        req.params.id,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      )

    if (!updatedWatch) {
      return res.status(404).json({
        success: false,
        message:
          'Watch not found during update',
      })
    }

    // ========================================================
    // DELETE OLD CLOUDINARY IMAGES
    // ========================================================

    if (
      req.files &&
      req.files.length > 0
    ) {
      for (const image of watch.images) {
        if (image.publicId) {
          try {
            await deleteImage(
              image.publicId
            )
          } catch (deleteError) {
            console.error(
              'Failed to delete old Cloudinary image:',
              deleteError
            )
          }
        }
      }
    }

    // ========================================================
    // SUCCESS
    // ========================================================

    res.status(200).json({
      success: true,
      message:
        'Watch updated successfully',
      watch: updatedWatch,
    })
  } catch (error) {
    console.error(
      'Update watch error:',
      error
    )

    // ========================================================
    // CLEANUP NEW CLOUDINARY IMAGES
    // ========================================================

    for (const image of newUploadedImages) {
      if (image.publicId) {
        try {
          await deleteImage(
            image.publicId
          )
        } catch (deleteError) {
          console.error(
            'Failed to cleanup new image:',
            deleteError
          )
        }
      }
    }

    // ========================================================
    // MONGOOSE ERRORS
    // ========================================================

    if (
      error.name ===
      'ValidationError'
    ) {
      return res.status(400).json({
        success: false,
        message: Object.values(
          error.errors
        )
          .map(
            (err) => err.message
          )
          .join(', '),
      })
    }

    // ========================================================
    // INVALID ID
    // ========================================================

    if (
      error.name ===
      'CastError'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid watch ID',
      })
    }

    // ========================================================
    // DUPLICATE KEY
    // ========================================================

    if (
      error.code === 11000
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Duplicate watch data',
      })
    }

    // ========================================================
    // SERVER ERROR
    // ========================================================

    res.status(500).json({
      success: false,
      message:
        error.message ||
        'Failed to update watch',
    })
  }
}

// ==============================
// DELETE WATCH
// ==============================
export const deleteWatch = async (
  req,
  res
) => {
  try {
    const watch =
      await Watch.findById(
        req.params.id
      )

    if (!watch) {
      return res.status(404).json({
        success: false,
        message:
          'Watch not found',
      })
    }

    // Delete Cloudinary images
    for (const image of watch.images) {
      if (image.publicId) {
        try {
          await deleteImage(
            image.publicId
          )
        } catch (deleteError) {
          console.error(
            'Failed to delete Cloudinary image:',
            deleteError
          )
        }
      }
    }

    await Watch.findByIdAndDelete(
      req.params.id
    )

    res.status(200).json({
      success: true,
      message:
        'Watch deleted successfully',
    })
  } catch (error) {
    console.error(
      'Delete watch error:',
      error
    )

    if (
      error.name ===
      'CastError'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid watch ID',
      })
    }

    res.status(500).json({
      success: false,
      message:
        error.message ||
        'Failed to delete watch',
    })
  }
}

