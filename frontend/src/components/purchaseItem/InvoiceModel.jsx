import React from "react";
import logo from "../../assets/Logo.jpg"; // Correctly import the logo
import { useNavigate } from "react-router-dom";

const InvoiceModal = ({ order, onClose }) => {
  const navigate = useNavigate()
  const deliveryDate = new Date(
    new Date(order.orderDate).getTime() + 5 * 24 * 60 * 60 * 1000
  );

  // Format Date as dd MMM yyyy (e.g. 05 Apr 2025)
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const logoUrl = window.location.origin + logo;
  
    const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .invoice-container { width: 100%; padding: 20px; box-sizing: border-box; }
          .invoice-header { display: flex; justify-content: space-between; align-items: center; }
          .logo-container { display: flex; align-items: center; }
          .invoice-header img { height: 50px; margin-right: 20px; }
          .invoice-body { margin-top: 20px; }
          .invoice-body hr { margin: 20px 0; border-color: #ccc; }
          .invoice-footer { margin-top: 20px; display: flex; justify-content: flex-end; align-items: center; gap: 10px; }
          .total-label { font-size: 18px; font-weight: bold; color: #1f2937; }
          .total-amount { font-size: 20px; font-weight: bold; color: green; }
          .details p { margin: 0; }
          .brand-name { display: flex; align-items: baseline; }
          .brand-name .initial { font-size: 2rem; font-weight: bold; font-style: italic; color: #15803d; }
          .brand-name .text { font-size: 1.125rem; font-weight: 600; color: #1f2937; margin-left: 0.25rem; }
    
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="logo-container">
              <img id="invoice-logo" src="${logoUrl}" alt="Logo" />
              <div class="brand-name">
                <span class="initial">N</span>
                <span class="text">ature's</span>
                <span class="initial" style="margin-left:0.25rem;">C</span>
                <span class="text">ure</span>
              </div>
            </div>
          </div>
          <div class="invoice-body">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>User ID:</strong> ${order.userId}</p>
            <p><strong>Order Date:</strong> ${formatDate(order.orderDate)}</p>
            <p><strong>Deliver Date:</strong> ${formatDate(deliveryDate)}</p>
            <hr />
            <h3>Items:</h3>
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            <hr />
            <div class="invoice-footer">
              <span class="total-label">Total Amount:</span>
              <div class="total-amount">₹${order.totalAmount.toFixed(2)}</div>
            </div>
            <hr />
            <div class="details">
              <h3>Shipping Details:</h3>
              <p><strong>Name:</strong> ${order.shippingDetails.name}</p>
              <p><strong>Email:</strong> ${order.shippingDetails.email}</p>
              <p><strong>Phone:</strong> ${order.shippingDetails.phone}</p>
              <p><strong>Address:</strong> ${order.shippingDetails.address}</p>
            </div>
          </div>
        </div>
    
        <script>
          const logo = document.getElementById('invoice-logo');
          logo.onload = () => {
            window.print();
          };
        </script>
      </body>
    </html>
    `;
    
  
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const on_close =()=>{
    
    navigate("/yourorder")
  }
  

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center pt-[15vh]">
  <div
    id="invoice-content"
    className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[80vh]"
  >
    <h2 className="text-3xl font-bold text-gray-800">Invoice</h2>
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 mr-4" />
        <div className="flex items-baseline">
          <span className="text-2xl font-bold italic text-green-700">N</span>
          <span className="text-xl font-semibold text-gray-800">ature's</span>
          <span className="ml-1 text-2xl font-bold italic text-green-700">C</span>
          <span className="text-xl font-semibold text-gray-800">ure</span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-red-500 hover:text-red-700 font-semibold text-lg"
      >
        X
      </button>
    </div>

    <div className="space-y-3">
      <p><span className="font-semibold">Order ID:</span> {order._id}</p>
      <p><span className="font-semibold">User ID:</span> {order.userId}</p>
      <p><span className="font-semibold">Order Date:</span> {formatDate(order.orderDate)}</p>
      <p><span className="font-semibold">Deliver Date:</span> {formatDate(deliveryDate)}</p>
    </div>

    <hr className="my-4 border-gray-300" />
    
    <div>
      <h3 className="text-2xl font-bold text-gray-700 mb-2">Items</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Item Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.itemId} className="border-t">
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">₹{item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <hr className="my-4 border-gray-300" />

    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-800">Total Amount:</h3>
      <p className="text-xl font-bold text-green-600">
        ₹{order.totalAmount.toFixed(2)}
      </p>
    </div>

    <hr className="my-4 border-gray-300" />

    <div className="space-y-1">
      <h3 className="text-2xl font-bold text-gray-700">Shipping Details</h3>
      <p><span className="font-semibold">Name:</span> {order.shippingDetails.name}</p>
      <p><span className="font-semibold">Email:</span> {order.shippingDetails.email}</p>
      <p><span className="font-semibold">Phone:</span> {order.shippingDetails.phone}</p>
      <p><span className="font-semibold">Address:</span> {order.shippingDetails.address}</p>
    </div>

    <div className="mt-6 flex justify-end space-x-4">
      <button
        onClick={handlePrint}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transition-all"
      >
        Print Invoice
      </button>
      <button
        onClick={on_close}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transition-all"
      >
        Close
      </button>
    </div>
  </div>
</div>

  );
};

export default InvoiceModal;
