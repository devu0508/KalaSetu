import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { Wishlist, ApiResponse } from '../../types';

interface WishlistState {
  wishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: null,
  isLoading: false,
  error: null,
};

// ── Thunks ────────────────────────────────────────────────────────

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<Wishlist>>('/wishlist');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch wishlist'
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Wishlist>>(
        `/wishlist/add/${productId}`
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add to wishlist'
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<Wishlist>>(
        `/wishlist/remove/${productId}`
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to remove from wishlist'
      );
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlist(state) {
      state.wishlist = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: WishlistState) => {
      state.isLoading = true;
      state.error = null;
    };
    const handleFulfilled = (state: WishlistState, action: any) => {
      state.isLoading = false;
      state.wishlist = action.payload;
    };
    const handleRejected = (state: WishlistState, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchWishlist.pending, handlePending)
      .addCase(fetchWishlist.fulfilled, handleFulfilled)
      .addCase(fetchWishlist.rejected, handleRejected);

    builder
      .addCase(addToWishlist.pending, handlePending)
      .addCase(addToWishlist.fulfilled, handleFulfilled)
      .addCase(addToWishlist.rejected, handleRejected);

    builder
      .addCase(removeFromWishlist.pending, handlePending)
      .addCase(removeFromWishlist.fulfilled, handleFulfilled)
      .addCase(removeFromWishlist.rejected, handleRejected);
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
