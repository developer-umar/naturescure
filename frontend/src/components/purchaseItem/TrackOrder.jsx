import React, { useState, useEffect } from "react";
import useOrder from "../../hooks/useOrder";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [showOrder, setShowOrder] = useState(false);
  const { order, loading, error } = useOrder(showOrder ? orderId : "");

  // Delivery timeline steps
  const deliveryTimeline = [
    { status: "placed", label: "Placed", description: "Order confirmed" },
    { status: "shipped", label: "Shipped", description: "Out for delivery" },
    { status: "delivered", label: "Delivered", description: "Delivered to your location" },
  ];

  // Animation state
  const [currentStep, setCurrentStep] = useState(-1);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId) return;
    setShowOrder(true);
    setCurrentStep(-1);
  };

  // Sync currentStep with animation - Stop at "Shipped"
  useEffect(() => {
    if (!showOrder) return;
    const timer1 = setTimeout(() => setCurrentStep(0), 800); // Placed
    const timer2 = setTimeout(() => setCurrentStep(1), 1600); // Shipped - Stop here
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [showOrder]);

  return (
    <div className="max-w-md mx-auto my-6 bg-white rounded-lg shadow-sm overflow-hidden">
      {showOrder && (
        <>
          {/* Order Header */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Order Tracking</h2>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-600">
                Ordered at{" "}
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  On time
                </span>
                <span className="text-sm font-medium text-gray-700">
                  Arriving Tomorrow
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-gray-900">Order #{orderId}</h3>
                <p className="text-sm text-gray-500">2 items</p>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="relative mb-6">
              {/* Background line */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
              
              {/* Progress line (green part) */}
              <div
                className={`absolute left-4 top-0 w-0.5 bg-green-500 h-0 ${
                  showOrder ? "animate-fill" : ""
                }`}
              ></div>
              
              {/* Moving ball */}
              {showOrder && (
                <div
                  className="absolute left-3.5 h-4 w-4 rounded-full bg-green-500 z-10 animate-move"
                ></div>
              )}
              
              <div className="space-y-6">
                {deliveryTimeline.map((step, index) => (
                  <div key={step.status} className="relative flex items-start">
                    {/* Dot outline (shows when step is completed) */}
                    {index <= currentStep && (
                      <div className="absolute left-4 top-1 h-2 w-2 rounded-full bg-green-500"></div>
                    )}
                    
                    <div className="ml-8">
                      <p
                        className={`text-sm font-medium ${
                          index <= currentStep ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      {index <= currentStep && (
                        <p className="text-xs text-gray-500 mt-1">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search Form */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          {showOrder ? "Track Another Order" : "Track Your Order"}
        </h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
          >
            Track
          </button>
        </form>
      </div>

      {loading && (
        <div className="p-6 text-center text-gray-600">
          Loading order details...
        </div>
      )}
      {error && <div className="p-6 text-center text-red-500">{error}</div>}
    </div>
  );
};

export default TrackOrder;