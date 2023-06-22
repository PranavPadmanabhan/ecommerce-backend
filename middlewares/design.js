const Design = require("../models/Design")
require("dotenv").config()
const { v4: uuidv4 } = require('uuid');
const admins = JSON.parse(process.env.DATA).admins

module.exports.AddDesign = async(req,res) => {
    try {
        const { name, phone,
            url, } = req.body
        if (name && phone && url &&   admins.includes(phone)) {
            const design = await new Design({
                designId:uuidv4(),
                name,
                creator:phone,
                url,
                createdByAdmins:true
            }).save()
            res.status(201).json(design)
        }
        else {
            res.status(200).json({ error: "unauthorized" })
        }
    } catch (error) {
        
    }
}  


module.exports.RemoveDesign = async (req, res) => {
    try {
        const { designId, phone } = req.body
        if (designId && admins.includes(phone)) {
            const design = await Design.findOne({ designId })
            if (design) {
                await Design.findOneAndDelete({ designId })
                res.status(200).json({ message: "Deleted Successfully " })
            }
            else {
                res.status(200).json({ error: " design doesnot exists" })
            }
        }
        else {
            res.status(200).json({ error: " unauthorized or fields missing" })
        }
    } catch (error) {

    }
}


module.exports.GetDesigns = async (req, res) => {
    try {
        const designs = await Design.find({})
        if (designs) {
            res.status(200).json(designs)
        }
        else {
            res.status(200).json({ error: "something went wrong" })
        }
    }

    catch (error) {

    }
}