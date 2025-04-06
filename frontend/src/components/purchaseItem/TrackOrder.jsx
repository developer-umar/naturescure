import React, { useState } from "react";
import useOrder from "../../hooks/useOrder";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const { order, loading, error } = useOrder(orderId);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId) return;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isStepCompleted = (step) => {
    const status = order?.orderStatus?.toLowerCase();
    return (
      step === "Placed" ||
      (step === "Shipped" && (status === "shipped" || status === "delivered")) ||
      (step === "Delivered" && status === "delivered")
    );
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Track Your Order</h2>
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Track
        </button>
      </form>

      {loading && <p className="text-center text-gray-600 mt-4">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {order && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Order Details</h3>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p>
            <strong>Status:</strong>
            <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded ${getStatusClass(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>

          {/* Stepper UI */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Order Progress</h4>
            <div className="flex items-center justify-between">
              {["Placed", "Shipped", "Delivered"].map((step, index) => {
                const completed = isStepCompleted(step);
                return (
                  <div key={step} className="flex flex-col items-center flex-1 relative">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold z-10 ${
                        completed ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="mt-2 text-sm">{step}</span>

                    {/* Progress line */}
                    {index < 2 && (
                      <div
                        className={`absolute top-4 left-full w-full h-1 ${
                          isStepCompleted(["Placed", "Shipped", "Delivered"][index + 1])
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Table */}
          <h4 className="mt-6 font-semibold">Items:</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.itemId} className="bg-white">
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ₹{item.quantity * item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="mt-4 text-lg font-semibold text-right">
            Grand Total: ₹{order.items.reduce((total, item) => total + item.quantity * item.price, 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
