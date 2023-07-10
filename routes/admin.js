const { Router } = require('express')
const { SignUp, SignIn, UpdateUser, GetUser } = require('../middlewares/adminUser.js')


const router = Router()

router.post("/signup",SignUp)
router.post("/signin",SignIn)
router.put("/user/:phone",UpdateUser)
router.get("/user/:phone",GetUser)




module.exports = router