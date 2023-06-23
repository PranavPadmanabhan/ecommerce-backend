const { Router } = require('express')
const {RequestVerification,Verify  } = require('../middlewares/verify.js')


const router = Router()


router.get("/requestVerification/:phone",RequestVerification)
router.get("/verify",Verify)

module.exports = router