import React, { useState } from "react";
import axios from "axios";
import PaymentMethod from "./Paymentmethod"; // Import Payment Modal
const CheckoutModal = ({ isOpen, onClose, cartItems, totalPrice, userId }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("❌ Please enter a valid 10-digit phone number!");
      return;
    }
    // console.log("Order Data being passed to PaymentMethod:", {
    //   userId: userId,
    //   items: cartItems.map((item) => ({
    //     itemId: item._id,
    //     name: item.name || item.common_name,
    //     price: item.price,
    //     quantity: item.quantity,
    //   })),
    //   totalAmount: totalPrice,
    //   shippingDetails: formData,
    // });

    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-[15vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[70vw] max-w-2xl max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">🛍️ Checkout</h2>
        <form onSubmit={handleProceedToPayment}>
          <div className="mb-3">
            <label className="block font-semibold">Full Name:</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter your name"
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold">Phone Number:</label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={(e) => {
                // Only allow digits
                const val = e.target.value;
                if (/^\d{0,10}$/.test(val)) {
                  handleChange(e);
                }
              }}
              className="w-full border p-2 rounded"
              placeholder="Enter your phone number"
              maxLength="10"
              pattern="\d{10}"
              title="Phone number must be exactly 10 digits"
            />

          </div>
          <div className="mb-3">
            <label className="block font-semibold">Address:</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter your address"
            />
          </div>
          <div className="mb-3">
            <label className="block font-semibold">Items in Cart:</label>
            <ul className="list-disc pl-5">
              {cartItems.map((item) => (
                <li key={item._id} className="border-b py-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">{item.name || item.common_name}</span>
                    <span className="text-gray-600">₹{(item.price ?? 0).toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-3">
            <label className="block font-semibold">Total Amount:</label>
            <p className="text-green-600 font-bold">₹{totalPrice.toFixed(2)}</p>
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600 text-white"}`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Payment ✅"}
          </button>
        </form>
        <button onClick={onClose} className="mt-3 text-red-500 underline">Cancel</button>
      </div>

      {/* Payment Modal */}

      {showPayment && (

        <PaymentMethod
          orderData={{
            userId: userId,
            items: cartItems.map((item) => ({
              itemId: item._id,
              name: item.name || item.common_name,
              price: item.price,
              quantity: item.quantity,
            })),
            totalAmount: totalPrice,
            shippingDetails: formData,
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default CheckoutModal;
