const Razorpay = require("razorpay")
const crypto = require("crypto");
const Order = require("../models/Orders");
require("dotenv").config()

var instance = new Razorpay({ key_id: process.env.RAZOR_PAY_ID, key_secret: process.env.RAZOR_PAY_SECRET })



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

module.exports.InitiatePayment = async (req, res) => {

    var options = {
        amount: req.body.price * 100,  // amount in the smallest currency unit
        currency: "INR",
        // receipt: "order_rcptid_11"
    };

    instance.orders.create(options, function (err, order) {
        if (err) {
            res.status(200).json({ error: err })
        }
        else {
            res.status(200).json(order)
        }
    });

}

module.exports.Verify = async (req, res) => {
    const { response, orderType, order } = req.body
    let body = response.razorpay_order_id + "|" + response.razorpay_payment_id;
    var expectedSignature = crypto.createHmac('sha256', process.env.RAZOR_PAY_SECRET).update(body.toString()).digest('hex')

    if (expectedSignature === response.razorpay_signature) {
        if (orderType === "normal") {
            const order = new Order({
                orderId: generateId(16),
                phone: order.phone,
                products: order.products,
                quantity: order.quantity,
                color: order.color,
                size: order.size,
                totalPrice: order.price,
                status: "Order Placed",
                address: order.address,
                deliveryDetails: {
                    message: "delivered within 4 to 5 working days"
                },
                paymentDetails: {
                    paymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id
                }

            }).save()
            res.status(200).send({ message: "Order Placed Successfully", order })
        }
        else {
            const order = await new Order({
                orderId: generateId(16),
                phone: order.phone,
                address: order.address,
                color: order.color,
                size: order.size,
                products: order.products,
                quantity: order.quantity,
                totalPrice: order.price,
                status: "Order Placed",
                deliveryDetails: {
                    message: "delivered within 4 to 5 working days"
                },
                paymentDetails: {
                    paymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id
                }
            }).save()
            res.status(200).send({ message: "Order Placed Successfully", order })

        }
    }
    else {
        res.status(200).send({ message: "Invalid signature" })

    }

}