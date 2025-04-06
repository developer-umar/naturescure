const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/cart", cartController.addToCart);
router.get("/cart/:userId", cartController.getCartItems);
router.delete("/cart/:userId/:plantId", cartController.removeFromCart);
router.put("/cart/:userId/:plantId", cartController.updateCartQuantity);
// Clear entire cart for a user
router.delete("/cart/:userId", cartController.clearCart);
router.get("/cart/:userId/totalquantity", cartController.totalQuantity);
module.exports = router;
