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
      const { data } = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
      setOrders(data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.patch(`/api/cancel/${orderId}`, { orderStatus: "Cancelled" });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
    } catch {
      setError("Failed to cancel order");
    }
  };


  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) return <p className="text-center text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-700">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full table-auto border border-gray-200 bg-white">
            <thead className="bg-green-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 border">#</th>
                <th className="px-4 py-3 border">Order ID</th>
                <th className="px-4 py-3 border">Items</th>
                <th className="px-4 py-3 border">Order Date</th>
                <th className="px-4 py-3 border">Delivery Date</th>
                <th className="px-4 py-3 border">Total (₹)</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border text-center">Print</th>
                <th className="px-4 py-3 border text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50 text-sm">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{order._id}</td>
                  <td className="px-4 py-2 border">
                    <ul className="list-disc ml-4">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-2 border">{formatDate( new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
)}</td>
                  <td className="px-4 py-2 border font-semibold">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-2 border text-green-600 font-medium">{order.orderStatus}</td>

                  {/* Print Button */}
                  <td className="px-4 py-2 border text-center">
                    <button
                      className={`text-xs px-3 py-1 rounded ${order.orderStatus === "Cancelled"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      onClick={() => order.orderStatus !== "Cancelled" && setSelectedOrder(order)}
                      disabled={order.orderStatus === "Cancelled"}
                    >
                      Print
                    </button>
                  </td>

                  {/* Delete Button */}
                  <td className="px-4 py-2 border text-center">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* Invoice Modal */}
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
