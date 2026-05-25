import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { buildUrl } from '../../utils/api';

const API_URL = buildUrl('/api/products/');

export const fetchProducts = createAsyncThunk('products/fetchAll', async (query = '', thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}list/?search=${query}`);
    return response.data.results || response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchProductDetails = createAsyncThunk('products/fetchSingle', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}list/${id}/`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      });
  }
});

export default productSlice.reducer;
