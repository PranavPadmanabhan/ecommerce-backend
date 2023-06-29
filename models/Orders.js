const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
    orderId:{ type:String, unique:true},
    phone:{ type: String },
    products:{type:[Object]},
    totalPrice:String,
    address:{
        type:{
            Name:String,
            Phone:String,
            PinCode:String,
            Address:String,
            CityorDistrict:String,
            State:String,
            Landmark:String,
        },
        required:true
    },
    status:String,
    deliveryDetails:{ type: Object },
    paymentDetails:{ type: Object }
})

module.exports = model("Order",orderSchema)
