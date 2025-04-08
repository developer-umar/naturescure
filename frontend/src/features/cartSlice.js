import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🛒 ✅ **Thunk to Fetch Cart Items from Backend**
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
  const response = await axios.get(`/api/cart/${userId}`);
  return response.data; // Cart items return honge
});

// 🛒 ✅ **Thunk to Add Item to Cart**
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, plantId, quantity }) => {
    const response = await axios.post("/api/cart", { userId, plantId, quantity });
    return response.data; // Updated cart item return hoga
  }
);

// 🛒 ✅ **Thunk to Remove Item from Cart**
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, plantId }) => {
    await axios.delete(`/api/cart/${userId}/${plantId}`);
    return plantId; // Sirf remove hone wale item ka ID return karenge
  }
);

// 🛒 ✅ **Thunk to Update Quantity**
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ userId, plantId, quantity }) => {
    const response = await axios.put(`/api/cart/${userId}/${plantId}`, { quantity });
    return response.data; // Updated cart item return hoga
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Cart Items
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItem = state.cartItems.find((item) => item.plantId === action.payload.plantId);
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.cartItems.push(action.payload);
        }
      })

      // ✅ Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter((item) => item.plantId !== action.payload);
      })

      // ✅ Update Quantity
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const item = state.cartItems.find((item) => item.plantId === action.payload.plantId);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
