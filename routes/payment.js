const { Router } = require('express')
const { InitiatePayment, Verify } = require('../middlewares/payment')


const router = Router()

router.post("/initiate",InitiatePayment)
router.post("/verify",Verify)




module.exports = router