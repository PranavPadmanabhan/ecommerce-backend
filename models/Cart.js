const { Schema, model } = require('mongoose')

const cartSchema = new Schema({
    cartId:{ type:String, unique:true},
    userId:{ type:String, unique:true},
    phone:{ type: String, required:true, unique:true },
    products:{ type: Array }
})

module.exports = model("Cart",cartSchema)