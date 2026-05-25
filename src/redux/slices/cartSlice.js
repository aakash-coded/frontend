import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { buildUrl } from '../../utils/api';

const API_URL = buildUrl('/api/cart/');

export const fetchCart = createAsyncThunk('cart/fetch', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  if (!token) return thunkAPI.rejectWithValue('No token');
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || { items: [] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  if (!token) {
    toast.error('Please login to add items to cart.');
    return thunkAPI.rejectWithValue('No token');
  }
  try {
    const response = await axios.post(
      `${API_URL}items/`,
      { product_id: productId, quantity: quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Added to cart!');
    return response.data;
  } catch (error) {
    toast.error('Could not add to cart.');
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  try {
    await axios.delete(`${API_URL}items/${itemId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Item removed from cart.');
    return itemId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  try {
    const response = await axios.patch(
      `${API_URL}items/${itemId}/`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
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
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state) => { state.loading = false; })
      .addCase(addToCart.fulfilled, (state, action) => {
        const existing = state.items.find((i) => i.product?.id === action.payload.product?.id);
        if (existing) {
          existing.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
