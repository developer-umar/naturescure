const Order = require("../models/Order");

// 📌 1. नया ऑर्डर बनाएं
// 📌 1. नया ऑर्डर बनाएं
const { sendOrderConfirmation } = require("../config/sendEmail"); // ✅ Import kiya

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingDetails, paymentMethod, generatedTransactionId } = req.body;

    if (!userId || !items || !totalAmount || !shippingDetails || !paymentMethod || !generatedTransactionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const paymentStatus = paymentMethod.toLowerCase() === "online" ? "Paid" : "pending";

    const order = new Order({
      userId,
      items,
      totalAmount,
      shippingDetails,
      paymentMethod,
      generatedTransactionId,
      paymentStatus,
    });

    await order.save();
    
    // ✅ Email bhejna after saving order
    await sendOrderConfirmation({
      to: order.shippingDetails.email,
      orderId: order._id,
      items: order.items,
      totalAmount: order.totalAmount,
    });
    

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 📌 2. ऑर्डर स्टेटस अपडेट करें (Payment Confirmation)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus, enteredTransactionId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

   

    if (orderStatus) order.orderStatus = orderStatus;

    await order.save();
    res.json({ message: "✅ Order updated successfully!", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 3. यूज़र के सारे ऑर्डर लाएं
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 4. एक ऑर्डर की डिटेल्स लाएं
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 5. ऑर्डर डिलीट करें
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const updated = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });

    if (!updated) return res.status(404).send("Order not found");

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).send("Server error");
  }
};