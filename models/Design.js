const { Schema, model } = require('mongoose')

const designSchema = new Schema({
    designId:{ type:String, unique:true},
    name:String,
    creator:String,
    url:String,
    createdByAdmins:Boolean
})

module.exports = model("Design",designSchema)