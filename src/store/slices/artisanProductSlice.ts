import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { Product, ApiResponse } from '../../types';

interface ArtisanProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ArtisanProductState = {
  products: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

// ── Thunks ────────────────────────────────────────────────────────

export const fetchMyProducts = createAsyncThunk(
  'artisanProducts/fetchMyProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ products: Product[] }>>('/artisan/products');
      return res.data.data.products;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch your products'
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  'artisanProducts/createProduct',
  async (
    data: { name: string; description?: string; price: number; category: string; images?: string[]; stock?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<Product>>('/artisan/products', data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create product'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'artisanProducts/updateProduct',
  async (
    { id, data }: { id: string; data: Partial<Product> },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<Product>>(`/artisan/products/${id}`, data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update product'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'artisanProducts/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/artisan/products/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────

const artisanProductSlice = createSlice({
  name: 'artisanProducts',
  initialState,
  reducers: {
    clearArtisanProductError(state) {
      state.error = null;
    },
    clearArtisanProductSuccess(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my products
    builder
      .addCase(fetchMyProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload);
        state.successMessage = 'Product created successfully';
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.products[idx] = action.payload;
        state.successMessage = 'Product updated successfully';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.successMessage = 'Product deleted successfully';
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearArtisanProductError, clearArtisanProductSuccess } = artisanProductSlice.actions;
export default artisanProductSlice.reducer;
