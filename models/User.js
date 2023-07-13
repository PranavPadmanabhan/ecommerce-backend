const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    userId:String,
    name:String,
    email:{ type: String },
    phone:{ type: String, unique:true },
    password: { type: String },
    profileImage:String,
    addresses:{ type: [{
        addressId:String,
        name:String,
        phone:String,
        locality:String,
        pinCode:String,
        address:String,
        city:String,
        state:String,
        landMark:String,
        alternateNumber:String,
        isHomeAddress:Boolean
    }] },
    VerifiedUser:Boolean
})

module.exports = model("User",userSchema)
