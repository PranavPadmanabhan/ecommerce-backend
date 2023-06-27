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
require("dotenv/config")

const app = express()

const PORT = process.env.PORT

mongoose.connect(process.env.MONGO_URI).then(() => console.log(`mongoDb connection successful..`)).catch(err => console.log(err))

app.use(cors({
    origin: 'https://inline-outfits.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type'],
  }));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://inline-outfits.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(apiKeyMiddleware)


app.use("/auth", userRoute)
app.use("/admin", adminUserRoute)
app.use("/user", verifyUserRoute)
app.use("/cart", cartRoute)
app.use("/orders", orderRoute)
app.use("/products", productRoute)
app.use("/designs", designRoute)
app.use("/patterns", patternRoute)
app.use("/payment", paymentRoute)

app.get("/", (req, res) => res.send("hello"))


app.listen(PORT, () => console.log(`app running at http://localhost:${PORT}`))

// users can create their own customized t shirts and they will get  5% of its price if anyone buys that design