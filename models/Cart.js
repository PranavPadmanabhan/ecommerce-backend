const { Schema, model } = require('mongoose')
const Product = require('./Product')

const cartSchema = new Schema({
    cartId:{ type:String, unique:true},
    userId:{ type:String, unique:true},
    phone:{ type: String, required:true, unique:true },
    products:{ type: [{
        productId:String,
        cartItemId:{ type: String, required:true, unique:true },
        product:{
            type:Object,
            ref:Product,
        },
        quantity:Number,
        color:Object,
        size:String
    }] }
})

module.exports = model("Cart",cartSchema)