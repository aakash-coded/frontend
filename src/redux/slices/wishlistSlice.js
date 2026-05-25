import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { buildUrl } from '../../utils/api';

const API_URL = buildUrl('/api/wishlist/');

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  if (!token) return thunkAPI.rejectWithValue('No token');
  
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || { items: [] };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  if (!token) {
    toast.error("Please login to add to wishlist");
    return thunkAPI.rejectWithValue('No token');
  }

  try {
    const response = await axios.post(`${API_URL}items/`, {
      product_id: productId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("Added to wishlist!");
    return response.data;
  } catch (error) {
    toast.error("Failed to add to wishlist");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (itemId, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  if (!token) {
    toast.error("Please login to manage your wishlist");
    return thunkAPI.rejectWithValue('No token');
  }

  try {
    await axios.delete(`${API_URL}items/${itemId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("Removed from wishlist");
    return itemId;
  } catch (error) {
    toast.error("Failed to remove from wishlist");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const exists = state.items.find(i => i.product.id === action.payload.product.id);
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export default wishlistSlice.reducer;
