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
        console.log("Fetched Cart Data:", data); // देखो data क्या आ रहा है
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [userId]);
  const handleUpdateQuantity = async (id, type) => {
    if (!userId) return;

    // Find the item from local cart using _id
    const item = cartItems.find((item) => item._id === id);
    if (!item) {
      console.error("Item not found in local state");
      return;
    }

    // Use plantId from the item for API call
    const plantId = item.plantId;

    const newQuantity = type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    // Update local state
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    // Dispatch with correct parameters
    dispatch(updateCartQuantity({ userId, plantId, quantity: newQuantity }));

    // Update backend API using plantId instead of _id
    try {
      const response = await fetch(`/api/cart/${userId}/${plantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  const handleRemoveItem = async (id) => {
    if (!userId || !id) {
      console.error("User ID or Item ID is missing");
      return;
    }

    // Pehle item ko find karo local state se, taaki uska plantId mil sake
    const item = cartItems.find((item) => item._id === id);
    if (!item) {
      console.error("Item not found in local state");
      return;
    }

    const plantId = item.plantId; // Yeh identifier backend ke liye sahi ho sakta hai

    // Local state update
    setCartItems((prevCart) => prevCart.filter((item) => item._id !== id));

    // Redux dispatch – ensure karo ki tum backend ke expected format ke hisaab se object bhej rahe ho
    dispatch(removeFromCart({ userId, plantId }));

    try {
      // API call mein plantId ka use karo
      const response = await fetch(`/api/cart/${userId}/${plantId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to remove item");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price ?? 0) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛒 Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Your cart is empty 😢</p>
            <Link to="/" className="text-green-500 font-semibold">Go back to shopping</Link>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between border-b py-3">
                <img src={item.static_image} alt={item.common_name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold">{item.common_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>ID:</strong> {item?._id}
                  </p>
                  <p className="text-gray-600">₹{(item.price ?? 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <button onClick={() => handleUpdateQuantity(item._id, "decrease")} className="px-2 bg-gray-200 rounded-l-lg">➖</button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item._id, "increase")} className="px-2 bg-gray-200 rounded-r-lg">➕</button>
                </div>
                <button onClick={() => handleRemoveItem(item._id)} className="ml-4 text-red-500">🗑️</button>
              </div>
            ))}
            <div className="mt-6 text-lg font-semibold">
              Total Price: <span className="text-green-500">₹{totalPrice.toFixed(2)}</span>
            </div>
            <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition" onClick={() => setIsModalOpen(true)}>
              Proceed to Checkout 💳
            </button>
          </div>
        )}
      </div>
      {isModalOpen && <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cartItems={cartItems} totalPrice={totalPrice} userId={userId} />}
    </div>
  );
};

export default Cart;
