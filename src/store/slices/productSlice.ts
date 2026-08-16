import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { Product, ProductListResponse, ApiResponse, Pagination } from '../../types';

interface ProductFilters {
  category: string;
  search: string;
  sort: string;
  page: number;
  limit: number;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  pagination: Pagination | null;
  filters: ProductFilters;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  pagination: null,
  filters: {
    category: '',
    search: '',
    sort: '',
    page: 1,
    limit: 12,
  },
  isLoading: false,
  isLoadingDetail: false,
  error: null,
};

// ── Thunks ────────────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: Partial<ProductFilters> | undefined, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.sort) query.set('sort', params.sort);

      const res = await api.get<ApiResponse<ProductListResponse>>(
        `/products?${query.toString()}`
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch single product
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
