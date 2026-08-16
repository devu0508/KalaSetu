import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { Cart, ApiResponse } from '../../types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

// ── Thunks ────────────────────────────────────────────────────────

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<Cart>>('/cart');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    data: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<Cart>>('/cart/add', data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add to cart'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (
    data: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<Cart>>(
        `/cart/update/${data.productId}`,
        { quantity: data.quantity }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update cart'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<Cart>>(
        `/cart/remove/${productId}`
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to remove from cart'
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<Cart>>('/cart/clear');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Helper to handle all cart operations the same way
    const handlePending = (state: CartState) => {
      state.isLoading = true;
      state.error = null;
    };
    const handleFulfilled = (state: CartState, action: any) => {
      state.isLoading = false;
      state.cart = action.payload;
    };
    const handleRejected = (state: CartState, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected);

    builder
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, handleRejected);

    builder
      .addCase(updateCartItem.pending, handlePending)
      .addCase(updateCartItem.fulfilled, handleFulfilled)
      .addCase(updateCartItem.rejected, handleRejected);

    builder
      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, handleFulfilled)
      .addCase(removeFromCart.rejected, handleRejected);

    builder
      .addCase(clearCart.pending, handlePending)
      .addCase(clearCart.fulfilled, handleFulfilled)
      .addCase(clearCart.rejected, handleRejected);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
