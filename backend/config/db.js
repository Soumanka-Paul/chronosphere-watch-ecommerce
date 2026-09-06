import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // Connect to MongoDB using URI from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`)
    // Exit process if DB connection fails
    process.exit(1)
  }
}

export default connectDB;