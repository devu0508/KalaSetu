import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { User, ApiResponse } from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: false,
  error: null,
};

// ── Thunks ────────────────────────────────────────────────────────

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    data: { name: string; email: string; password: string; role?: 'customer' | 'artisan' },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<User>>('/auth/signup', data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Signup failed'
      );
    }
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<User>>('/auth/signin', data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Sign in failed'
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<User>>('/auth/me');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Not authenticated'
      );
    }
  }
);

export const exchangeOAuthToken = createAsyncThunk(
  'auth/exchangeOAuthToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<User>>('/auth/exchange-token', { token });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'OAuth authentication failed'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Logout failed'
      );
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Signin
    builder
      .addCase(signin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check auth (on app load)
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Exchange OAuth Token
    builder
      .addCase(exchangeOAuthToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exchangeOAuthToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        try {
          if (action.payload && (action.payload as any).token) {
            localStorage.setItem('kalasetu_token', (action.payload as any).token);
          }
        } catch {}
      })
      .addCase(exchangeOAuthToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        try {
          localStorage.removeItem('kalasetu_token');
        } catch {}
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
