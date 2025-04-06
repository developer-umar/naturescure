const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true, match: /^\d{10}$/ },
    address: { type: String, required: true },
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "Paid", "failed"],
    default: "pending",
  },
  paymentMethod:{
    type: String
  },
  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },
  generatedTransactionId: {
    type: String,
    required: true,
  },
  enteredTransactionId: {
    type: String,
    required: false,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
 
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
