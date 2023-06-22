const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    userId:String,
    name:String,
    email:{ type: String },
    phone:{ type: String, required:true, unique:true },
    password: { type: String },
    profileImage:String,
    addresses:{ type: Array },
    VerifiedUser:Boolean
})

module.exports = model("User",userSchema)
