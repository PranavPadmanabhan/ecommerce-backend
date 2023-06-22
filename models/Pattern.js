const { Schema, model } = require('mongoose')

const patternSchema = new Schema({
    patternId:{ type:String, unique:true},
    name:String,
    creator:String,
    url:String,
    createdByAdmins:Boolean
})

module.exports = model("Pattern",patternSchema)