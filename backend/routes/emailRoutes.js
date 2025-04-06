const express = require("express");
const router = express.Router();
const { sendOrderConfirmation } = require("../config/sendEmail");

router.post("/send", async (req, res) => {
  const {
    shippingDetails: { email },
    generatedTransactionId,
    items,
    totalAmount
  } = req.body;

  try {
    const firstItem = items[0]; // single item ke liye
    await sendOrderConfirmation({
      to: email,
      orderId: generatedTransactionId,
      productName: firstItem.name,
      price: totalAmount,
    });

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;
