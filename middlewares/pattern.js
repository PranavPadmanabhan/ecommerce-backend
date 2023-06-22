const Pattern = require("../models/Pattern")
require("dotenv").config()
const { v4: uuidv4 } = require('uuid');
const admins = JSON.parse(process.env.DATA).admins

module.exports.AddPattern = async(req,res) => {
    try {
        const { name, phone,
            url, } = req.body
        if (name && phone && url &&   admins.includes(phone)) {
            const pattern = await new Pattern({
                patternId:uuidv4(),
                name,
                creator:phone,
                url,
                createdByAdmins:true
            }).save()
            res.status(201).json(pattern)
        }
        else {
            res.status(200).json({ error: "unauthorized" })
        }
    } catch (error) {
        
    }
}  


module.exports.RemovePattern = async (req, res) => {
    try {
        const { patternId, phone } = req.body
        if (patternId && admins.includes(phone)) {
            const pattern = await Pattern.findOne({ patternId })
            if (pattern) {
                await Pattern.findOneAndDelete({ patternId })
                res.status(200).json({ message: "Deleted Successfully " })
            }
            else {
                res.status(200).json({ error: " pattern doesnot exists" })
            }
        }
        else {
            res.status(200).json({ error: " unauthorized or fields missing" })
        }
    } catch (error) {

    }
}


module.exports.GetPatterns = async (req, res) => {
    try {
        const patterns = await Pattern.find({})
        if (patterns) {
            res.status(200).json(patterns)
        }
        else {
            res.status(200).json({ error: "something went wrong" })
        }
    }

    catch (error) {

    }
}