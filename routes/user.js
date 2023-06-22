const { Router } = require('express')
const { SignUp, SignIn, UpdateUser } = require('../middlewares/user.js')


const router = Router()

router.post("/signup",SignUp)
router.post("/signin",SignIn)
router.put("/user/:phone",UpdateUser)



module.exports = router