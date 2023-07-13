const { Router } = require('express')
const { SignUp, SignIn, UpdateUser, GetUser, RemoveAddress, AddAddress } = require('../middlewares/user.js')


const router = Router()

router.post("/signup",SignUp)
router.post("/signin",SignIn)
router.put("/user/:phone",UpdateUser)
router.get("/user/:phone",GetUser)
router.put("/user/address/remove/:phone",RemoveAddress)
router.put("/user/address/add/:phone",AddAddress)



module.exports = router