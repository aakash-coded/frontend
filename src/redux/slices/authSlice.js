import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { buildUrl } from '../../utils/api';

const API_URL = buildUrl('/api/auth/');

const getErrorMessage = (error, defaultMessage) => {
  if (!error?.response) return error?.message || defaultMessage;
  const data = error.response.data;
  if (!data) return error.response.statusText || defaultMessage;
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  if (data.message) return data.message;
  if (Array.isArray(data)) return data.join(' ');
  if (typeof data === 'object') {
    return Object.values(data)
      .flatMap((value) => Array.isArray(value) ? value : [value])
      .join(' ')
      .trim() || defaultMessage;
  }
  return defaultMessage;
};

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL + 'login/', userData);
    localStorage.setItem('access', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    toast.success("Logged in successfully");
    return response.data;
  } catch (error) {
    const errMsg = getErrorMessage(error, "Invalid credentials");
    toast.error(errMsg);
    return thunkAPI.rejectWithValue(error.response?.data || errMsg);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL + 'register/', userData);
    toast.success("Registration successful!");
    return response.data;
  } catch (error) {
    const errMsg = getErrorMessage(error, "Registration failed");
    toast.error(errMsg);
    return thunkAPI.rejectWithValue(error.response?.data || errMsg);
  }
});

export const fetchUserProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;
  if (!token) return thunkAPI.rejectWithValue('No token');
  try {
    const response = await axios.get(API_URL + 'profile/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('access') || null,
    isAuthenticated: !!localStorage.getItem('access'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      toast.success("Logged out successfully");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
