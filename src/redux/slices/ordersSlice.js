import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { buildUrl } from '../../utils/api';

const API_URL = buildUrl('/api/orders/');

const getErrorMessage = (error, defaultMessage) => {
  if (!error?.response) return error?.message || defaultMessage;
  const data = error.response.data;
  if (!data) return error.response.statusText || defaultMessage;
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  if (data.error) return data.error;
  if (typeof data === 'object') {
    return Object.values(data)
      .flatMap((value) => Array.isArray(value) ? value : [value])
      .join(' ')
      .trim() || defaultMessage;
  }
  return defaultMessage;
};

export const fetchOrders = createAsyncThunk('orders/fetch', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch orders');
  }
});

export const placeOrder = createAsyncThunk('orders/place', async (orderData, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  try {
    const res = await axios.post(API_URL, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Order placed successfully!');
    return res.data;
  } catch (err) {
    const errMsg = getErrorMessage(err, 'Failed to place order. Please try again.');
    toast.error(errMsg);
    return thunkAPI.rejectWithValue(err.response?.data || errMsg);
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async ({ orderId, reason = '' }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  try {
    const res = await axios.post(`${API_URL}${orderId}/cancel/`, { reason }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Order cancelled successfully.');
    return res.data;
  } catch (err) {
    const errMsg = getErrorMessage(err, 'Failed to cancel order. Please try again.');
    toast.error(errMsg);
    return thunkAPI.rejectWithValue(err.response?.data || errMsg);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    placing: false,
    error: null,
    lastOrder: null,
    cancelling: false,
  },
  reducers: {
    clearLastOrder: (state) => {
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : action.payload.results || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(placeOrder.pending, (state) => { state.placing = true; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placing = false;
        state.lastOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state) => { state.placing = false; })
      .addCase(cancelOrder.pending, (state) => { state.cancelling = true; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancelling = false;
        state.orders = state.orders.map((order) => (
          order.id === action.payload.id ? action.payload : order
        ));
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancelling = false;
        state.error = action.payload;
      });
  },
});

export const { clearLastOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
