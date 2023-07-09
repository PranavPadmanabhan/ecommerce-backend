const Product = require("../models/Product.js")
const { v4: uuidv4 } = require('uuid');
require("dotenv").config()
const admins = JSON.parse(process.env.DATA).admins

module.exports.AddProduct = async (req, res) => {
    try {
        const { name, description, price, images, phone, details, colors, sizes } = req.body
        if (name && description && price && images && sizes && colors && admins.includes(phone)) {
            const product = await new Product({
                productId: uuidv4(),
                name,
                description,
                images,
                sizes,
                colors: colors ?? null,
                details: details ?? null,
                price
            }).save()
            res.status(201).json(product)
        }
        else {
            res.status(200).json({ error: "unauthorized" })
        }
    } catch (error) {

    }
}

module.exports.AdminUpdate = async (req, res) => {
    try {
        const { name, description, images, sizes, colors, details, price, productId } = req.body
        if (productId) {
            const product = await Product.findOne({ productId })
            if (product) {
                product.name = name ?? product.name
                product.description = description ?? product.description
                product.images = images ?? product.images
                product.sizes = sizes ?? product.sizes
                product.colors = colors ?? product.colors
                product.details = details ?? product.details
                product.price = price ?? product.price
                const updated = await product.save()
                res.json(updated)
            }
            else {
                res.json({ error: "product doesn't exist" })
            }
        }
        else {
            res.json({ error: "fields missing" })
        }
    } catch (error) {

    }
}

module.exports.RemoveProduct = async (req, res) => {
    try {
        const { productId, phone } = req.body
        if (productId && admins.includes(phone)) {
            const product = await Product.findOne({ productId })
            if (product) {
                await Product.findOneAndDelete({ productId })
                res.status(200).json({ message: "Deleted Successfully " })
            }
            else {
                res.status(200).json({ error: " product doesnot exists" })
            }
        }
        else {
            res.status(200).json({ error: " unauthorized or fields missing" })
        }
    } catch (error) {

    }
}

module.exports.GetProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        if (products) {
            res.status(200).json(products)
        }
        else {
            res.status(200).json({ error: "something went wrong" })
        }
    }

    catch (error) {

    }
}

module.exports.GetProduct = async (req, res) => {
    try {
        const { id } = req.query
        const product = await Product.findOne({ productId: id })
        if (product) {
            res.status(200).json(product)
        }
        else {
            res.status(200).json({ error: "product not found!" })
        }
    }

    catch (error) {

    }
}