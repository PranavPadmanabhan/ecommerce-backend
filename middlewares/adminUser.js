const AdminUser = require('../models/AdminUser.js')
const bcrypt = require('bcrypt')
const saltRounds = 10;
require("dotenv").config()
const { v4: uuidv4 } = require('uuid');
const admins = JSON.parse(process.env.DATA).admins

module.exports.SignUp = async (req, res, next) => {
    const { name, phone, password } = req.body
   try {
    if (name && phone && password) {
        if (admins.includes(phone)) {

            const user = await AdminUser.findOne({ phone })
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
                            const newUser = await new AdminUser({
                                userId:uuidv4(),
                                name,
                                phone,
                                password: hash,
                                addresses: [],
                                VerifiedUser: false
                            }).save()
                            
                            res.status(201).json({ message: "signup successful ", user: newUser })
                        }
                    });
                });
            }
        }
        else {
            res.status(200).json({ error: "UnAuthorized" })
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
        if (admins.includes(phone)) {
            const user = await AdminUser.findOne({ phone })
            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
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
            res.status(200).json({ error: "UnAuthorized" })

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
    const { name, addresses, email, password, isVerified,profileImage } = req.body
    try {
        if (name || password || email || addresses || isVerified || profileImage) {
            const user = await AdminUser.findOne({ phone })
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
