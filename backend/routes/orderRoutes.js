const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);
router.get("/user/:userId", orderController.getOrdersByUser);
router.get("/:orderId", orderController.getOrderById);
router.put("/:orderId", orderController.updateOrderStatus);
router.delete("/:orderId", orderController.deleteOrder);
router.patch("/cancel/:orderId",orderController.cancelOrder)
module.exports = router;
