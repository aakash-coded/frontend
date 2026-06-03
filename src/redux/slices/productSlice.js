import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { buildUrl } from '../../utils/api';

const API_URL = buildUrl('/api/products/');

export const fetchProducts = createAsyncThunk('products/fetchAll', async (query = '', thunkAPI) => {
  try {
    const firstResponse = await axios.get(`${API_URL}list/?search=${encodeURIComponent(query)}`);
    const firstData = firstResponse.data;
    if (!firstData?.results) {
      return firstData;
    }

    const products = [...firstData.results];
    let nextUrl = firstData.next;
    while (nextUrl) {
      const nextResponse = await axios.get(nextUrl);
      products.push(...(nextResponse.data.results || []));
      nextUrl = nextResponse.data.next;
    }
    return products;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch products');
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
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.error = action.payload;
      });
  }
});

export default productSlice.reducer;
