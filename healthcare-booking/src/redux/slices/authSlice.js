import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  forgotPasswordMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, action) => { state.loading = true; state.error = null; },
    loginSuccess: (state, action) => { state.loading = false; state.user = action.payload; state.isAuthenticated = true; state.error = null; },
    loginFailure: (state, action) => { state.loading = false; state.error = action.payload; state.isAuthenticated = false; },
    registerRequest: (state, action) => { state.loading = true; state.error = null; },
    registerSuccess: (state, action) => { state.loading = false; state.user = action.payload; state.isAuthenticated = true; state.error = null; },
    registerFailure: (state, action) => { state.loading = false; state.error = action.payload; state.isAuthenticated = false; },
    forgotPasswordRequest: (state, action) => { state.loading = true; state.error = null; },
    forgotPasswordSuccess: (state, action) => { state.loading = false; state.forgotPasswordMessage = action.payload; state.error = null; },
    forgotPasswordFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    logout: (state) => { state.user = null; state.isAuthenticated = false; state.error = null; },
    clearAuthError: (state) => { state.error = null; state.forgotPasswordMessage = null; },
    setAuthLoading: (state, action) => { state.loading = action.payload; },
  }
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  logout,
  clearAuthError,
  setAuthLoading
} = authSlice.actions;

export default authSlice.reducer;
