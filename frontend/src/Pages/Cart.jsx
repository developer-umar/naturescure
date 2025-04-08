import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CheckoutModal from "../components/purchaseItem/CheckoutModal";
import { updateQuantity as updateCartQuantity, removeFromCart } from "../features/cartSlice";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/cart/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch cart");
        const data = await response.json();
        // console.log("Fetched Cart Data:", data);
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [userId]);

  const handleUpdateQuantity = async (id, type) => {
    if (!userId) return;
    const item = cartItems.find((item) => item._id === id);
    if (!item) {
      console.error("Item not found in local state");
      return;
    }
    const plantId = item.plantId;
    const newQuantity = type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    dispatch(updateCartQuantity({ userId, plantId, quantity: newQuantity }));

    try {
      const response = await fetch(`/api/cart/${userId}/${plantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!response.ok) throw new Error(await response.text());
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    if (!userId || !id) {
      console.error("User ID or Item ID is missing");
      return;
    }
    const item = cartItems.find((item) => item._id === id);
    if (!item) {
      console.error("Item not found in local state");
      return;
    }
    const plantId = item.plantId;

    setCartItems((prevCart) => prevCart.filter((item) => item._id !== id));
    dispatch(removeFromCart({ userId, plantId }));

    try {
      const response = await fetch(`/api/cart/${userId}/${plantId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to remove item");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">🛒 Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="text-sm sm:text-base">Your cart is empty 😢</p>
            <Link to="/" className="text-green-500 font-semibold text-sm sm:text-base">
              Go back to shopping
            </Link>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-3 gap-4 sm:gap-0"
              >
                <img
                  src={item.static_image}
                  alt={item.common_name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                />
                <div className="flex-1 ml-0 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold">{item.common_name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    <strong>ID:</strong> {item?._id}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">₹{(item.price ?? 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, "decrease")}
                      className="px-2 py-1 bg-gray-200 rounded-l-lg text-sm sm:text-base"
                    >
                      ➖
                    </button>
                    <span className="px-2 sm:px-3 text-sm sm:text-base">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, "increase")}
                      className="px-2 py-1 bg-gray-200 rounded-r-lg text-sm sm:text-base"
                    >
                      ➕
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500 text-sm sm:text-base"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6 text-base sm:text-lg font-semibold">
              Total Price: <span className="text-green-500">₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg text-base sm:text-lg font-semibold hover:bg-green-600 transition"
              onClick={() => setIsModalOpen(true)}
            >
              Proceed to Checkout 💳
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cartItems={cartItems}
          totalPrice={totalPrice}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Cart;