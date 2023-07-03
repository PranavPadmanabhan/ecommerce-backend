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

app.get("/", (req, res) => res.send("hello"))


app.listen(PORT, () => console.log(`app running at http://localhost:${PORT}`))

// users can create their own customized t shirts and they will get  5% of its price if anyone buys that design


