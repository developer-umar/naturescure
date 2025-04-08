import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import InvoiceModal from "./InvoiceModel";

const YourOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`/api/orders/user/${userId}`);
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.patch(`/api/orders/cancel/${orderId}`, { 
        orderStatus: "Cancelled" 
      });
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
      ));
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("Failed to cancel order. Please try again.");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`/api/orders/${orderId}`);
      setOrders(prev => prev.filter(order => order._id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order. Please try again.");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-gray-500 text-lg">Loading orders...</p>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <p className="text-red-500 text-lg">{error}</p>
      <button 
        onClick={fetchOrders}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 lg:mb-10 text-green-700">
        Your Orders
      </h2>
      
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8 text-lg">No orders found</p>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-6">
            {orders.map((order, index) => (
              <div key={order._id} className="border rounded-xl p-4 shadow-md bg-white">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-base">Order #{index + 1}</p>
                    <p className="text-xs text-gray-500 break-all">{order._id}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    order.orderStatus === "Cancelled" ? "bg-red-100 text-red-800" :
                    order.orderStatus === "Delivered" ? "bg-green-100 text-green-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
                
                <div className="mt-4">
                  <p className="font-medium text-sm">Items:</p>
                  <ul className="list-disc ml-5 text-sm">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p>{formatDate(order.orderDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Delivery Date</p>
                    <p>{formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000))}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-semibold">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    className={`flex-1 text-sm px-4 py-2 rounded-lg transition-colors ${
                      order.orderStatus === "Cancelled"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => order.orderStatus !== "Cancelled" && setSelectedOrder(order)}
                    disabled={order.orderStatus === "Cancelled"}
                  >
                    Print
                  </button>
                  <button
                    className={`flex-1 text-sm px-4 py-2 rounded-lg transition-colors ${
                      order.orderStatus === "Cancelled"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                    onClick={() => cancelOrder(order._id)}
                    disabled={order.orderStatus === "Cancelled"}
                  >
                    Cancel
                  </button>
                  <button
                    className={`flex-1 text-sm px-4 py-2 rounded-lg transition-colors ${
                      order.orderStatus === "Cancelled"
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={() => order.orderStatus === "Cancelled" && deleteOrder(order._id)}
                    disabled={order.orderStatus !== "Cancelled"}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-green-100 text-gray-700 text-sm">
                <tr>
                  <th className="px-6 py-4 border-b">#</th>
                  <th className="px-6 py-4 border-b">Order ID</th>
                  <th className="px-6 py-4 border-b">Items</th>
                  <th className="px-6 py-4 border-b">Order Date</th>
                  <th className="px-6 py-4 border-b">Delivery Date</th>
                  <th className="px-6 py-4 border-b">Total (₹)</th>
                  <th className="px-6 py-4 border-b">Status</th>
                  <th className="px-6 py-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id} className="hover:bg-gray-50 text-sm">
                    <td className="px-6 py-4 border-b text-center">{index + 1}</td>
                    <td className="px-6 py-4 border-b break-all">{order._id}</td>
                    <td className="px-6 py-4 border-b">
                      <ul className="list-disc ml-4">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 border-b">{formatDate(order.orderDate)}</td>
                    <td className="px-6 py-4 border-b">{formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000))}</td>
                    <td className="px-6 py-4 border-b font-semibold">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 border-b">
                      <span className={`font-medium ${
                        order.orderStatus === "Cancelled" ? "text-red-600" :
                        order.orderStatus === "Delivered" ? "text-green-600" :
                        "text-blue-600"
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex gap-2 justify-center">
                        <button
                          className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                            order.orderStatus === "Cancelled"
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                          onClick={() => order.orderStatus !== "Cancelled" && setSelectedOrder(order)}
                          disabled={order.orderStatus === "Cancelled"}
                        >
                          Print
                        </button>
                        <button
                          className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                            order.orderStatus === "Cancelled"
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-yellow-500 hover:bg-yellow-600 text-white"
                          }`}
                          onClick={() => cancelOrder(order._id)}
                          disabled={order.orderStatus === "Cancelled"}
                        >
                          Cancel
                        </button>
                        <button
                          className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                            order.orderStatus === "Cancelled"
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          onClick={() => order.orderStatus === "Cancelled" && deleteOrder(order._id)}
                          disabled={order.orderStatus !== "Cancelled"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedOrder && (
        <InvoiceModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default YourOrder;