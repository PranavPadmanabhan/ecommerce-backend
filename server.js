const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoute = require('./routes/user.js')
const adminUserRoute = require('./routes/admin.js')
const verifyUserRoute = require('./routes/verify.js')
const cartRoute = require('./routes/cart.js')
const orderRoute = require('./routes/order.js')
const productRoute = require('./routes/products.js')
const designRoute = require('./routes/designs.js')
const patternRoute = require('./routes/patterns.js')
const paymentRoute = require('./routes/payment.js')
const { apiKeyMiddleware } = require('./utils/helper-functions.js')
const Product = require('./models/Product.js')
const Cart = require('./models/Cart.js')
require("dotenv/config")

const app = express()

const PORT = process.env.PORT || 3000

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set')
    }
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log('MongoDB connection successful..')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    // In production, you might want to exit the process
    // process.exit(1)
  }
}

connectDB()


app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use("/auth",apiKeyMiddleware, userRoute)
app.use("/admin",apiKeyMiddleware, adminUserRoute)
app.use("/user",apiKeyMiddleware, verifyUserRoute)
app.use("/cart",apiKeyMiddleware, cartRoute)
app.use("/orders",apiKeyMiddleware, orderRoute)
app.use("/products",apiKeyMiddleware, productRoute)
app.use("/designs",apiKeyMiddleware, designRoute)
app.use("/patterns",apiKeyMiddleware, patternRoute)
app.use("/payment",apiKeyMiddleware, paymentRoute)

// Health check endpoint for load balancers and monitoring
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  })
})

app.get("/", (req, res) => res.send("hello"))

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`App running at http://0.0.0.0:${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed')
      process.exit(0)
    })
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed')
      process.exit(0)
    })
  })
})

// users can create their own customized t shirts and they will get  5% of its price if anyone buys that design


// const stream = Product.watch()

// stream.on("change",async(change) => {
//     // console.log(change)
//     if(change.operationType === "update"){
//         const product = await Product.findById(change.documentKey)
//         if(product){
//             const cart = await Cart.find({"_id":change.documentKey})
//             console.log(cart)
//         }
//     }
// })