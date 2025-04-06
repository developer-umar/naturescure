import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import InvoiceModal from "./InvoiceModel";
import bitcoinimg1 from '../../../public/images/bitcoinimg1.jpg';

const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
};

const PaymentMethod = ({ orderData, onPaymentSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [transactionId, setTransactionId] = useState(generateTransactionId());
  const [userTransactionId, setUserTransactionId] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(300);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (showQR && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showQR, countdown]);

  // Timeout handler
  useEffect(() => {
    if (countdown === 0 && showQR && !paymentConfirmed) {
      alert("⏰ Payment time expired. Please try again.");
      onCancel();
    }
  }, [countdown, showQR, paymentConfirmed, onCancel]);

  const getQRCodeValue = () => {
    if (paymentMethod === "Online") {
      return `upi://pay?pa=satyamkushwaha200202-1@okaxis&pn=Divyanshu Kushwaha&tid=${transactionId}&tr=${orderData.totalAmount}`;
    }
    return "";
  };

  const clearCart = async userId => {
    try {
      await axios.delete(`/api/cart/${userId}`);
      localStorage.removeItem("cart");
    } catch (err) {
      console.error("❌ Failed to clear cart:", err);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    if (paymentMethod === "COD") {
      try {
        const res = await axios.post("/api/orders", {
          ...orderData,
          userId: orderData.userId,
          paymentMethod: "COD",
          paymentStatus: "Pending",
          generatedTransactionId: "CASH",
        });
        alert(`✅ Order Placed Successfully! Order ID: ${res.data.order._id}`);
        setOrderDetails(res.data.order);
        await clearCart(orderData.userId);
        setInvoiceModalVisible(true);
      } catch (err) {
        alert("❌ Failed to place order! " + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    } else {
      setShowQR(true);
      setLoading(false);
    }
  };

  const handleTransactionSubmit = async () => {
    const idToUse = userTransactionId.trim();
    if (!idToUse) {
      alert("❌ Please enter the Transaction ID!");
      return;
    }
    try {
      const res = await axios.post("/api/orders", {
        ...orderData,
        userId: orderData.userId,
        paymentMethod,
        paymentStatus: "Paid",
        generatedTransactionId: idToUse,
      });
      alert(`✅ Payment Confirmed! Transaction ID: ${idToUse}\nOrder ID: ${res.data.order._id}`);
      setPaymentConfirmed(true);
      setOrderDetails(res.data.order);
      await clearCart(orderData.userId);
      setInvoiceModalVisible(true);
    } catch (err) {
      alert("❌ Payment Confirmation Failed! " + (err.response?.data?.error || err.message));
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel payment?")) {
      onCancel();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <h2 className="text-xl font-bold mb-4">💳 Select Payment Method</h2>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Payment Options:</label>
            <select
              className="w-full border p-2 rounded"
              value={paymentMethod}
              onChange={e => {
                setPaymentMethod(e.target.value);
                setShowQR(false);
                setPaymentConfirmed(false);
                setUserTransactionId("");
                setCountdown(300);
                setTransactionId(generateTransactionId());
              }}
            >
              <option value="COD" disabled={orderData.totalAmount > 5000}>
                Cash on Delivery (COD)
              </option>
              <option value="Online">Online Payment</option>
              <option value="BitCoin">Bitcoin Payment</option>
            </select>
          </div>

          {!showQR ? (
            <button
              className={`w-full py-2 rounded-lg ${
                loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              disabled={loading}
              onClick={handlePayment}
            >
              {loading ? "Processing..." : "Proceed to Pay"}
            </button>
          ) : countdown <= 0 ? (
            <p className="text-red-500 font-semibold text-center mt-4">
              ⏰ Payment Time Expired
            </p>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-gray-700 font-semibold mb-2">Scan the QR Code to Pay:</p>
              {paymentMethod === "BitCoin" ? (
                <img src={bitcoinimg1} alt="Bitcoin QR" className="w-44 h-44 object-contain" />
              ) : (
                <QRCode value={getQRCodeValue()} size={180} />
              )}
              <p className="text-sm text-gray-500 mt-2">
                Use {paymentMethod === "Online" ? "UPI / Net Banking" : "Bitcoin Wallet"} to Pay.
              </p>
              <p className="text-xs text-gray-600 mt-1">
                ⏳ QR expires in: {Math.floor(countdown / 60)}:
                {("0" + (countdown % 60)).slice(-2)}
              </p>

              {/* UPI / Bitcoin both use manual TXN entry */}
              {(paymentMethod === "Online" || paymentMethod === "BitCoin") && !paymentConfirmed && (
                <div className="mt-4 w-full">
                  {paymentMethod === "Online" && (
                    <p className="text-sm text-gray-800 mb-2">
                      UPI ID: <span className="font-semibold">satyamkushwaha200202-1@okaxis</span>
                      <button
                        className="ml-2 text-blue-500 underline text-sm"
                        onClick={() =>
                          navigator.clipboard.writeText("satyamkushwaha200202-1@okaxis")
                        }
                      >
                        Copy
                      </button>
                    </p>
                  )}

                  <label className="block font-semibold">Enter Transaction ID:</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded mt-1"
                    placeholder="Enter Transaction ID"
                    value={userTransactionId}
                    onChange={e => setUserTransactionId(e.target.value)}
                  />
                  <button
                    className="w-full mt-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    onClick={handleTransactionSubmit}
                  >
                    Confirm Payment
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleCancel}
            className="mt-3 text-red-500 underline w-full text-center"
          >
            Cancel
          </button>
        </div>
      </div>

      {invoiceModalVisible && orderDetails && (
        <InvoiceModal
          order={orderDetails}
          onClose={() => {
            setInvoiceModalVisible(false);
            onPaymentSuccess();
          }}
        />
      )}
    </>
  );
};

export default PaymentMethod;
