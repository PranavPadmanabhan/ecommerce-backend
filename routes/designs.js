const { Router } = require('express')
const { AddDesign, RemoveDesign, GetDesigns } = require('../middlewares/design.js')


const router = Router()

router.get("/", GetDesigns)
router.post("/admin", AddDesign)
router.delete("/admin", RemoveDesign)


module.exports = router