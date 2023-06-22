const { Schema, model } = require('mongoose')

const adminUserSchema = new Schema({
    userId:String,
    name:String,
    email:{ type: String, unique:true },
    phone:{ type: String, required:true, unique:true },
    password: { type: String },
    profileImage:String,
    VerifiedUser:Boolean
})

module.exports =  model("adminUser",adminUserSchema)
