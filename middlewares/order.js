const Order = require("../models/Orders.js")
const Product = require("../models/Product.js")
require("dotenv").config()
const admins = JSON.parse(process.env.DATA).admins

function generateId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '1234567890'
    let result = '';
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    // }
    for (let i = 0; i < length; i++) {
        result += numbers.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

module.exports.PlaceOrder = async (req, res) => {
    const { phone, products, quantity, address, color, size, price } = req.body;
    try {
        if (phone && products && quantity && address && color && size && price) {
            
            if (products) {
                const order = new Order({
                    orderId: generateId(16),
                    phone,
                    products,
                    quantity,
                    color,
                    size,
                    totalPrice: price,
                    status: "Order Placed",
                    address,
                    deliveryDetails: {
                        message: "delivered within 4 to 5 working days"
                    }

                }).save()
                const orders = await Order.find({ phone })
                res.status(201).json({ message: "Order Placed SuccessFully", orders })
            }
            else {
                res.status(200).json({ error: "something went wrong!" })
            }
        }
        else {
            res.status(200).json({ error: "Fields are missing" })
        }
    } catch (error) {

    }
}

module.exports.GetOrders = async (req, res) => {
    const { phone } = req.params;
    try {
        if (phone) {
            const orders = await Order.find({ phone })
            if (orders) {
                res.status(200).json(orders)
            }
            else {
                res.status(200).json({ error: "something went wrong!" })
            }
        }
        else {
            res.status(200).json({ error: "Fields are missing" })
        }
    } catch (error) {

    }
}

module.exports.CancelOrder = async (req, res) => {
    const { phone, orderId, address } = req.body;
    try {
        if (phone && orderId && address) {
            const order = await Order.findOne({ orderId, phone })
            if (order) {
                if (order.status === "Order Placed") {
                    await Order.findOneAndDelete({ phone, orderId })
                    const orders = await Order.find({ phone })
                    res.status(201).json({ message: "Order Deleted SuccessFully", orders })
                }
                else {
                    res.status(200).json({ error: "Cannot Cancel this order" })

                }
            }
            else {
                res.status(200).json({ error: "something went wrong!" })
            }
        }
        else {
            res.status(200).json({ error: "Fields are missing" })
        }
    } catch (error) {

    }
}


module.exports.UpdateOrder = async (req, res) => {
    const { phone, orderId } = req.body;
    try {
        if (phone && orderId) {
            const order = await Order.findOne({ orderId, phone })
            if (order) {
                order.address = address ?? order.address
                const updated = await order.save()
                res.status(200).json({ message: "Order Updated Successfully", order: updated })
            }
            else {
                res.status(200).json({ error: "something went wrong!" })
            }
        }
        else {
            res.status(200).json({ error: "Fields are missing" })
        }
    } catch (error) {

    }
}

module.exports.UpdateOrderAdminOnly = async (req, res) => {
    const { phone, orderId, status, deliveryDetails } = req.body;
    try {
        if (phone && orderId && admins.includes(phone)) {
            const order = await Order.findOne({ orderId })
            if (order) {
                order.status = status ?? order.status
                order.deliveryDetails = deliveryDetails ?? order.deliveryDetails
                const updated = await order.save()
                res.status(200).json({ message: "Order Updated Successfully", order: updated })
            }
            else {
                res.status(200).json({ error: "something went wrong!" })
            }
        }
        else {
            res.status(200).json({ error: "unautorized or some fields are missing" })
        }
    } catch (error) {

    }
}

module.exports.AdminOrders = async (req, res) => {
    try {
        const { phone } = req.params
        const orders = await Order.find({})
        if (orders.length > 0 && admins.includes(phone)) {
            res.status(200).json(orders)
        }
        else {
            res.status(200).json({ error: "unauthorized" })
        }
    } catch (error) {

    }
}

module.exports.AddCustomOrder = async (req, res) => {
    try {
        const { phone, address, quantity, details, designs, price, color, size } = req.body
        if (phone && address && quantity && designs && price && color && size) {
            const order = await new Order({
                orderId: generateId(16),
                phone,
                address,
                color,
                size,
                products: [{
                    ...details,
                    designs
                }],
                quantity,
                totalPrice: price,
                status: "Order Placed",
                deliveryDetails: {
                    message: "delivered within 4 to 5 working days"
                }
            }).save()
            res.status(201).json(order)
        }
        else {
            res.status(200).json({ error: "some fields are missing" })
        }
    } catch (error) {

    }
}