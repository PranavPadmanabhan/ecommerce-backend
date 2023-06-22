const { Router } = require('express')
const { AddPattern,GetPatterns,RemovePattern } = require("../middlewares/pattern")

const router = Router()

router.get("/", GetPatterns)
router.post("/admin", AddPattern)
router.delete("/admin", RemovePattern)


module.exports = router