const { Router } = require('express')
const { GetCart, AddToCart, RemoveQuantityFromCart, RemoveProductFromCart, AddCustomProductToCart } = require('../middlewares/cart')


const router = Router()

router.get("/:phone",GetCart)
router.post("/",AddToCart)
router.post("/custom",AddCustomProductToCart)
router.put('/reduce',RemoveQuantityFromCart)
router.put('/remove',RemoveProductFromCart)



module.exports = router