const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');
const Cart = require('../models/Cart.js');
const saltRounds = 10;

module.exports.SignUp = async (req, res, next) => {
    const { name, phone, password } = req.body
    try {
        if (name && phone && password) {
            const user = await User.findOne({ phone })
            const cart = await Cart.findOne({ phone })

            if (user) {
                res.status(200).json({ error: "user already exists!!" })
            }
            else {
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(password, salt, async (err, hash) => {
                        if (err) {
                            res.status(200).json({ error: err })
                        }
                        else {
                            const newUser = await new User({
                                userId: uuidv4(),
                                name,
                                phone,
                                password: hash,
                                addresses: [],
                                VerifiedUser: false
                            }).save()
                            if (cart) {
                                await Cart.findOneAndDelete({ phone })
                                const newCart = await new Cart({
                                    cartId: uuidv4(),
                                    phone,
                                    products: [],
                                    userId: newUser.userId
                                }).save()
                            }
                            else {
                                const newCart = await new Cart({
                                    cartId: uuidv4(),
                                    phone,
                                    products: [],
                                    userId: newUser.userId
                                }).save()
                            }
                            res.status(201).json({
                                message: "signup successful ", user: await User.findOne({ phone }).select([
                                    "userId",
                                    "name",
                                    "email",
                                    "phone",
                                    "profileImage",
                                    "VerifiedUser",
                                    "addresses"
                                ])
                            })
                        }
                    });
                });
            }
        }
        else {
            res.status(200).json({ error: "fields missing!!" })
        }
    } catch (error) {

    }
}

module.exports.SignIn = async (req, res) => {
    const { phone, password } = req.body
    try {
        if (phone && password) {
            const user = await User.findOne({ phone }).select([
                "userId",
                "name",
                "email",
                "phone",
                "profileImage",
                "VerifiedUser",
                "addresses"
            ])
            if (user) {
                bcrypt.compare(password, (await User.findOne({ phone })).password, function (err, result) {
                    if (result === true) {
                        res.status(200).json({ message: "signin successfull", user })
                    }
                    else {
                        res.status(200).json({ error: "wrong password!!" })
                    }
                });
            }
            else {
                res.status(200).json({ error: "user doesnot exist!!" })

            }
        }
        else {
            res.status(200).json({ error: "fields missing!!" })
        }
    } catch (error) {

    }
}

module.exports.UpdateUser = async (req, res, next) => {
    const { phone } = req.params
    const { name, addresses, email, password, isVerified, profileImage } = req.body
    try {
        if (name || password || email || addresses || isVerified || profileImage) {
            const user = await User.findOne({ phone }).select([
                "userId",
                "name",
                "email",
                "phone",
                "profileImage",
                "VerifiedUser",
                "addresses"
            ])
            if (user) {

                if (password) {
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        bcrypt.hash(password, salt, async (err, hash) => {
                            if (err) {
                                res.status(200).json({ error: err })
                            }
                            else {
                                user.name = name ?? user.name;
                                user.email = email ?? user.email
                                user.password = hash ?? user.password
                                user.VerifiedUser = isVerified ?? user.VerifiedUser
                                user.profileImage = profileImage ?? user.profileImage
                                user.addresses = addresses ?? user.addresses
                                const updated = await user.save()
                                res.status(200).json({ message: "updated successfully", user: updated })
                            }
                        });
                    });
                }
                else {
                    user.name = name ?? user.name;
                    user.email = email ?? user.email
                    user.VerifiedUser = isVerified ?? user.VerifiedUser
                    user.profileImage = profileImage ?? user.profileImage
                    user.addresses = addresses ?? user.addresses
                    const updated = await user.save()
                    res.status(200).json({ message: "updated successfully", user: updated })
                }

            }
            else {
                res.status(200).json({ error: "user doesnot exist!!" })
            }
        }
        else {
            res.status(200).json({ error: "fields missing!!" })
        }
    } catch (error) {

    }
}

module.exports.GetUser = async (req, res) => {
    try {
        const { phone } = req.params;
        const user = await User.findOne({ phone }).select([
            "userId",
            "name",
            "email",
            "phone",
            "profileImage",
            "VerifiedUser",
            "addresses"
        ])
        if (user) {
            res.status(200).json(user)
        }
        else {
            res.status(200).json({ error: "user not found!!" })
        }
    } catch (error) {

    }
}

module.exports.RemoveAddress = async (req, res) => {
    const { phone } = req.params
    const { addressId } = req.body;
    try {
        const user = await User.findOne({ phone })
        if (user) {
            await User.updateOne({ phone }, {
                $set:{
                    addresses:user?.addresses?.filter(item => item.addressId !== addressId)
                }
            })
            res.status(200).json({ message: "successful" })
        }
        else {
            res.status(200).json({ error: "user not found " })
        }
    } catch (error) {

    }
}

module.exports.AddAddress = async (req, res) => {
    const { phone } = req.params
    const { address } = req.body;
    try {
        const newAddress = {
            addressId: uuidv4(),
            name: address.name,
            phone: address.phone,
            locality: address.locality,
            pinCode: address.pinCode,
            address: address.address,
            city: address.city,
            state: address.state,
            landMark: address.landMark,
            alternateNumber: address.alternateNumber,
            isHomeAddress: address.isHomeAddress
        }
        const user = await User.findOne({ phone })
        if (user) {
            await User.updateOne({ phone }, {
                $push: {
                    addresses: newAddress
                }
            })
            res.status(200).json({ message: "successful" })
        }
        else {
            res.status(200).json({ error: "user not found " })
        }
    } catch (error) {

    }
}