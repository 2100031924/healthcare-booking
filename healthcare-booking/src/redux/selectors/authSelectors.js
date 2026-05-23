// Auth Selectors
export const selectAuthState = (state) => state.auth;

export const selectUser = (state) => state.auth.user;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectAuthError = (state) => state.auth.error;

export const selectForgotPasswordMessage = (state) => state.auth.forgotPasswordMessage;

export const selectUserName = (state) => state.auth.user?.name || 'User';

export const selectUserEmail = (state) => state.auth.user?.email || '';

export const selectUserRole = (state) => state.auth.user?.role || 'patient';
