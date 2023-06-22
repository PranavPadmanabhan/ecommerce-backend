const Cart = require("../models/Cart.js")
const Product = require("../models/Product.js")
const { v4: uuidv4 } = require('uuid');


module.exports.GetCart = async (req, res) => {
    try {
        const { phone } = req.params
        const cart = await Cart.findOne({ phone })
        if (cart) {
            res.status(200).json(cart)
        }
        else {
            res.status(200).json({ error: "Cart Doesnot exists" })
        }
    } catch (error) {

    }
}

module.exports.AddToCart = async (req, res) => {
    try {
        const { productId, phone, color,size } = req.body;
        if (productId && phone && color&&size) {
            const prod = await Product.findOne({ productId })
            const cart = await Cart.findOne({ phone })
            if (prod && cart) {
                const filtered = cart.products.filter((item) => (item.productId === productId && item.color === color && item.size === size))
                if (filtered.length > 1) {
                    cart.products = cart.products.map(item => item.productId === productId ? { ...item, quantity: filtered.length + 1 } : item);
                    const updated = await cart.save()
                    res.status(201).json({ cart: updated })
                }
                else {
                    cart.products = [...cart.products, { ...prod, quantity: 1, color,size }]
                    const updated = await cart.save()
                    res.status(201).json({ cart: updated })
                }
            }
            else {
                res.status(200).json({ error: 'something went wrong!' })
            }
        }
        else {
            res.status(200).json({ error: 'Fields are missing!' })
        }
    } catch (error) {

    }
}

module.exports.RemoveQuantityFromCart = async (req, res) => {
    try {
        const { productId, phone } = req.body;
        if (productId && phone) {
            const prod = await Product.findOne({ productId })
            const cart = await Cart.findOne({ phone })
            if (prod && cart) {
                const filtered = cart.products.filter((item) => item.productId === productId)
                if (filtered.length > 1) {
                    cart.products = cart.products.map(item => item.productId === productId ? { ...item, quantity: filtered.length - 1 } : item);
                    const updated = await cart.save()
                    res.status(201).json({ cart: updated })
                }
                else {
                    cart.products = cart.products.filter(item => item.productId !== productId)
                    const updated = await cart.save()
                    res.status(201).json({ cart: updated })
                }
            }
            else {
                res.status(200).json({ error: 'something went wrong!' })
            }
        }
        else {
            res.status(200).json({ error: 'Fields are missing!' })
        }
    } catch (error) {

    }
}


module.exports.RemoveProductFromCart = async (req, res) => {
    try {
        const { productId, phone } = req.body;
        if (productId && phone) {
            const prod = await Product.findOne({ productId })
            const cart = await Cart.findOne({ phone })
            if (prod && cart) {

                cart.products = cart.products.filter(item => item.productId !== productId)
                const updated = await cart.save()
                res.status(201).json({ cart: updated })
            }
            else {
                res.status(200).json({ error: 'something went wrong!' })
            }
        }
        else {
            res.status(200).json({ error: 'Fields are missing!' })
        }
    } catch (error) {

    }
}

module.exports.AddCustomProductToCart = async (req, res) => {
    try {
        const { color, images, designs, phone, size } = req.body
        if (color && designs) {
            const cart = await Cart.findOne({ phone })
            cart.products = [...cart.products, {
                productId:uuidv4(),
                designs,
                name: "Customized Product",
                images: images ?? null,
                quantity: 1,
                size,
            }]
            const updated = await cart.save()
            res.status(200).json({cart:updated})
        }
        else {
            res.status(200).json({ error: 'Fields are missing!' })
        }
    } catch (error) {

    }
}