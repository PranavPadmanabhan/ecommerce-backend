const { Router } = require('express')
const { GetOrders, PlaceOrder, CancelOrder, UpdateOrder, UpdateOrderAdminOnly, AdminOrders, AddCustomOrder, GetOrder, GetAdminOrder } = require('../middlewares/order.js')


const router = Router()

router.get("/:phone", GetOrders)
router.get("/admin/:phone/:orderId", GetAdminOrder)
router.get("/order/:orderId", GetOrder)
router.post("/", PlaceOrder)
router.post("/custom", AddCustomOrder)
router.delete("/cancel", CancelOrder)
router.put("/update", UpdateOrder)
router.put("/update/admin", UpdateOrderAdminOnly)
router.get("/admin/:phone", AdminOrders)





module.exports = router