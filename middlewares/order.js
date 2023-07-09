const Cart = require("../models/Cart.js");
const Order = require("../models/Orders.js")
const Product = require("../models/Product.js")
require("dotenv").config()
const admins = JSON.parse(process.env.DATA).admins

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }
  

module.exports.PlaceOrder = async (req, res) => {
    const { phone, products, address, price } = req.body;
    try {
        if (phone && products && address && price) {
            if (products) {
                for (let i = 0; i < products.length; i++) {
                    const order = await new Order({
                        orderId: generateRandomString(32),
                        phone,
                        product:products[i],
                        totalPrice: parseInt(products[i].product.price) * parseInt(products[i].quantity),
                        status: "Order Placed",
                        address:{
                            Name:address.name,
                            Address:address.address,
                            CityorDistrict:address.city,
                            Landmark:address.landMark,
                            Phone:address.phone,
                            PinCode:address.pinCode,
                            State:address.state  
                        },
                        deliveryDetails: {  
                            message: "delivered within 10 working days"
                        }
                    }).save()   
                }
                const orders = await Order.find({ phone })
                const cart = await Cart.findOne({ phone });
                cart.products = cart.products.filter(item => {
                    for (let i = 0; i < products.length; i++) {
                        return item.cartItemId !== products[i].cartItemId;
                    }
                })
                await cart.save()
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

module.exports.GetOrder = async (req, res) => {
    const { phone,orderId } = req.params;
    try {
        if (phone && orderId && admins.includes(phone)) {
            const order = await Order.findOne({ orderId })
            if (order) {
                res.status(200).json(order)
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
        if (admins.includes(phone)) {
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
        const { phone, address, details, designs, price } = req.body
        if (phone && address && designs && price) {
            const order = await new Order({
                orderId: generateRandomString(32),
                phone,
                address,
                products: [{
                    ...details,
                    designs
                }],
                totalPrice: price,
                status: "Order Placed",
                deliveryDetails: {
                    message: "delivered within 10 working days"
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