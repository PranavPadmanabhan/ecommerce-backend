const { Router } = require('express')
const { GetProducts, GetProduct, AddProduct, RemoveProduct, AdminUpdate } = require('../middlewares/products')


const router = Router()

router.get("/", GetProducts)
router.get("/product", GetProduct)
router.put("/product/update", AdminUpdate)
router.post("/admin", AddProduct)
router.delete("/admin", RemoveProduct)


module.exports = router