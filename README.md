# ⌚ Chronosphere — Luxury Watch E-Commerce Platform

**Chronosphere** is a full-stack luxury watch e-commerce platform built using the **MERN stack**. It provides a complete online shopping experience with secure authentication, product browsing, cart and wishlist management, online payments, order tracking, reviews and ratings, and a dedicated admin dashboard.

The project is designed with a modern, minimal, and premium UI inspired by luxury watch brands.

---

## ✨ Features 

### 👤 User Authentication

* User registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Protected routes
* Authentication-aware navigation
* Secure logout
* Forgot password functionality
* Password reset using email
* Role-based admin access

### ⌚ Watch Catalog

* Browse luxury watches
* Search and explore products
* View detailed watch information
* Brand-based product organization
* Product images hosted through Cloudinary
* Product stock availability
* Discount pricing
* Product ratings and reviews

### 🛒 Shopping Cart

* Add watches to cart
* Remove items from cart
* Increase/decrease quantity
* Stock-aware quantity management
* Automatic price calculation
* Cart item count in navbar
* Login required for adding products to cart

### ❤️ Wishlist

* Add watches to wishlist
* Remove watches from wishlist
* Dedicated wishlist page
* Wishlist button on product cards
* Authentication-protected wishlist functionality

### 💳 Online Payment

* Razorpay payment integration
* Secure payment order creation
* Payment verification
* Order creation after successful payment
* Automatic stock reduction after successful payment

### 📦 Orders

* Place orders after successful payment
* View previous orders
* Order details
* Order status management
* Admin order management
* Stock synchronization after purchase

### ⭐ Reviews & Ratings

* Submit product reviews
* Star-based ratings
* Display average product rating
* Display number of reviews
* Review cards
* Rating component

### 👨‍💼 Admin Dashboard

Administrators have access to a dedicated dashboard for managing the e-commerce platform.

Admin features include:

* Dashboard overview
* Add new watches
* Update watches
* Delete watches
* Manage product stock
* Manage orders
* Update order status
* Manage users
* Role-based admin authorization

### ☁️ Cloudinary Integration

Product images are uploaded and managed using **Cloudinary**, allowing the application to efficiently handle watch images without storing large image files directly in MongoDB.



### 📱 Responsive UI

* Responsive design for desktop, tablet, and mobile
* Modern luxury-inspired interface
* Tailwind CSS styling
* Smooth hover effects and transitions
* Mobile navigation menu
* Responsive product cards

---

# 🛠️ Tech Stack

## Frontend

* **React.js**
* **Vite**
* **React Router**
* **Tailwind CSS**
* **Lucide React**
* **Axios**
* **React Hot Toast**

## Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcryptjs**
* **Cloudinary**
* **Razorpay**

## Development Tools

* VS Code
* Git & GitHub
* MongoDB Atlas / MongoDB
* MongoDB Compass
* Postman

---

# 🏗️ Project Architecture

Chronosphere follows a **MERN-based client-server architecture**.

```text
                    ┌──────────────────────┐
                    │      React.js        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                         Axios / HTTP
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Express.js       │
                    │      Backend API     │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          ┌──────────┐   ┌──────────┐   ┌──────────┐
          │ MongoDB  │   │Cloudinary│   │ Razorpay │
          │ Database │   │  Images  │   │ Payments │
          └──────────┘   └──────────┘   └──────────┘
                               │
                               ▼
                         ┌──────────┐
                         │SMTP SERVER│
                         │     │
                         └──────────┘
```

---

# 📁 Project Structure

```text
Chronosphere/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   ├── review.controller.js
│   │   ├── watch.controller.js
│   │   └── wishlist.controller.js
│   │
│   ├── middleware/
│   │   ├── admin.middleware.js
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── order.model.js
│   │   ├── review.model.js
│   │   ├── user.model.js
│   │   ├── watch.model.js
│   │   └── wishlist.model.js
│   │
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   ├── review.routes.js
│   │   ├── watch.routes.js
│   │   └── wishlist.routes.js
│   │
│   ├── utils/
│   │   └── cloudinaryUpload.js
│   │
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
│
├── frontend/
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │   └── Watch & Brand Images
│   │   │
│   │   ├── components/
│   │   │   ├── BrandBanner.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── WatchCard.jsx
│   │   │   └── WishlistButton.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── useWishlist.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── WatchDetail.jsx
│   │   │   └── Wishlist.jsx
│   │   │
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminRoute.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageOrders.jsx
│   │   │       ├── ManageUsers.jsx
│   │   │       └── ManageWatches.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── axios.js
│   │   │   ├── constants.js
│   │   │   └── formatPrice.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── .gitignore
└── README.md
```

---

# 🔐 Authentication Flow

Chronosphere uses **JWT-based authentication**.

```text
User
 │
 ▼
Register / Login
 │
 ▼
Backend Authentication
 │
 ├── bcrypt → Password Hashing
 │
 └── JWT → Authentication Token
 │
 ▼
Authenticated User
 │
 ▼
Protected Routes
```

Protected functionality includes:

* Shop
* Watch details
* Cart
* Wishlist
* Orders
* Checkout
* Admin dashboard

---

# 💳 Payment Flow

Razorpay is integrated for online payments.

```text
User
 │
 ▼
Add Watch to Cart
 │
 ▼
Checkout
 │
 ▼
Create Razorpay Order
 │
 ▼
Razorpay Payment
 │
 ▼
Payment Verification
 │
 ▼
Successful Payment
 │
 ├── Create Order
 │
 ├── Reduce Product Stock
 │
 └── Show Order Confirmation
```

---



# ☁️ Image Upload Flow

Product images are handled through Cloudinary.

```text
Admin
 │
 ▼
Select Watch Image
 │
 ▼
Backend
 │
 ▼
Cloudinary Upload
 │
 ▼
Cloudinary Image URL
 │
 ▼
MongoDB Watch Document
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Soumanka-Paul/chronosphere-watch-ecommerce.git
```

Navigate into the project:

```bash
cd chronosphere-watch-ecommerce
```

---

# 🖥️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

> **Important:** Never commit your `.env` file or real API keys, database credentials, email passwords, JWT secrets, or payment secrets to GitHub.

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

# 🌐 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run on the Vite development server, typically:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

The following environment variables are required by the backend:

| Variable                | Purpose                              |
| ----------------------- | ------------------------------------ |
| `PORT`                  | Backend server port                  |
| `MONGO_URI`             | MongoDB connection string            |
| `JWT_SECRET`            | JWT signing secret                   |
| `JWT_EXPIRE`            | JWT expiration time                  |
| `CLIENT_URL`            | Frontend URL                         |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                   |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                |
| `RAZORPAY_KEY_ID`       | Razorpay public key                  |
| `RAZORPAY_KEY_SECRET`   | Razorpay secret                      |
| `EMAIL_USER`            | Email account used by Nodemailer     |
| `EMAIL_PASS`            | Email app password / SMTP credential |

---

# 🧪 Testing the Application

After starting both servers:

### Customer Flow

```text
Register
   ↓
Login
   ↓
Browse Watches
   ↓
View Watch Details
   ↓
Add to Wishlist
   ↓
Add to Cart
   ↓
Checkout
   ↓
Razorpay Payment
   ↓
Order Confirmation
   ↓
View Orders
   ↓
Review Purchased Product
```

### Admin Flow

```text
Admin Login
   ↓
Admin Dashboard
   ├── Manage Watches
   ├── Manage Orders
   └── Manage Users
```

---

# 🛡️ Security

Chronosphere implements several security-related practices:

* Password hashing using bcrypt
* JWT authentication
* Protected API routes
* Role-based admin authorization
* Protected frontend routes
* Environment variables for sensitive credentials
* Payment verification before order completion
* Stock validation during cart and order processing

---

# 📌 Future Improvements

Some features that can be added in future versions:

* Advanced product filtering
* Product sorting
* Search suggestions
* Coupon and discount system
* Multiple payment methods
* Address management
* User profile management
* Product comparison
* Recently viewed products
* Email notifications for order updates
* Order cancellation and refund workflow
* Sales analytics and charts
* Deployment automation with CI/CD

---

# 🎯 Learning Objectives

This project was built to gain practical experience with:

* Full-stack MERN development
* REST API development
* React component architecture
* React Context API
* Authentication and authorization
* JWT-based security
* MongoDB data modeling
* Mongoose relationships
* Payment gateway integration
* Cloudinary image management
* Email automation with Nodemailer
* Admin dashboard development
* Git and GitHub
* Production-oriented project structure

---

# 👨‍💻 Author

## Soumanka Paul

**B.Tech Information Technology Student**

Interested in:

* Full Stack Development
* MERN Stack
* Backend Development
* Software Engineering
* Problem Solving & DSA

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is created for educational and portfolio purposes.
