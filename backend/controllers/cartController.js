const Cart = require("../models/Cart");
const Plant = require("../models/Plant"); // ✅ Plant model import किया

// ✅ Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, plantId, quantity } = req.body;

    // 🔍 Plant की price fetch करो
    const plant = await Plant.findById(plantId);
    if (!plant) return res.status(404).json({ message: "Plant not found" });

    let cartItem = await Cart.findOne({ userId, plantId });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ userId, plantId, quantity, price: plant.price }); // ✅ Price add किया
    }

    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: "Error adding item to cart" });
  }
};

// ✅ Get all cart items for a user (Price भी return होगा)
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId }).populate("plantId");

    const formattedCartItems = cartItems.map(item => ({
      _id: item._id,
      userId: item.userId,
      plantId: item.plantId._id,
      common_name: item.plantId.common_name,
      static_image: item.plantId.static_image,
      quantity: item.quantity,
      price: item.price // ✅ Ensure price is returned
    }));

    res.json(formattedCartItems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart items" });
  }
};

// ✅ Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId, plantId: req.params.plantId });
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

// ✅ Update quantity of an item in the cart
exports.updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    let cartItem = await Cart.findOne({ userId: req.params.userId, plantId: req.params.plantId });

    if (!cartItem) return res.status(404).json({ message: "Item not found" });

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: "Error updating quantity" });
  }
};

// 🔹 5. Cart पूरी तरह से Clear करें
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await Cart.deleteOne({ userId });

    res.status(200).json({ message: "✅ Cart cleared successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Error clearing cart: " + error.message });
  }
};


exports.totalQuantity=async(req,res)=>{
  // GET /cart/total-quantity
  try {
    const cartItems = await Cart.find({});
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    res.status(200).json({ totalQuantity });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch total quantity", error });
  }


}
