import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { Artisan, ArtisanListResponse, ApiResponse } from '../../types';

interface ArtisanState {
  artisans: Artisan[];
  selectedArtisan: Artisan | null;
  pagination: ArtisanListResponse['pagination'] | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  filters: {
    craft: string;
    featured?: boolean;
    page: number;
  };
}

const initialState: ArtisanState = {
  artisans: [],
  selectedArtisan: null,
  pagination: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  filters: {
    craft: '',
    page: 1,
  },
};

// ── Thunks ────────────────────────────────────────────────────────

export const fetchArtisans = createAsyncThunk(
  'artisans/fetchArtisans',
  async (
    params: { craft?: string; featured?: boolean; page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams();
      if (params.craft) query.set('craft', params.craft);
      if (params.featured !== undefined) query.set('featured', String(params.featured));
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));

      const res = await api.get<ApiResponse<ArtisanListResponse>>(
        `/artisans?${query.toString()}`
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch artisans');
    }
  }
);

export const fetchArtisanById = createAsyncThunk(
  'artisans/fetchArtisanById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<Artisan>>(`/artisans/${id}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch artisan');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────

const artisanSlice = createSlice({
  name: 'artisans',
  initialState,
  reducers: {
    setArtisanFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedArtisan(state) {
      state.selectedArtisan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtisans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtisans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artisans = action.payload.artisans;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchArtisans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchArtisanById.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchArtisanById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.selectedArtisan = action.payload;
      })
      .addCase(fetchArtisanById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.payload as string;
      });
  },
});

export const { setArtisanFilters, clearSelectedArtisan } = artisanSlice.actions;
export default artisanSlice.reducer;
