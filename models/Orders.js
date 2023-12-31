const { Schema, model } = require('mongoose')
const Product = require('./Product')

const orderSchema = new Schema({
    orderId: { type: String, unique: true },
    phone: { type: String },
    product: { type: Object, ref: Product },
    totalPrice: String,
    address: {
        type: {
            Name: String,
            Phone: String,
            PinCode: String,
            Address: String,
            CityorDistrict: String,
            State: String,
            Landmark: String,
        },
        required: true
    },
    status: String,
    deliveryDetails: { type: Object },
    paymentDetails: { type: Object },
    createdAt:Number
})

module.exports = model("Order", orderSchema)
