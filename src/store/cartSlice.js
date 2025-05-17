import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}seeb-cart/getCart/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log("✅ API Response:", response.data)
    return response.data.data;
  } catch (err) {
    // Return the error message from the response if available
    return rejectWithValue(err.response?.message || "Something went wrong.");
  }
});

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_BASE_URL}seeb-cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete item.");
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart(state) {
      state.items = []; // 🧹 Clears all cart items
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});


export const { removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
