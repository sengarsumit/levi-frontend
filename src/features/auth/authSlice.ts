import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { decodeJwt } from '../../lib/jwt';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null;
  permissions: string[];
  orgSlug: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  user: null, 
  permissions: [],
  orgSlug: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user?: any }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      
      const decoded = decodeJwt(action.payload.token);
      state.permissions = (decoded.permissions as string[]) || [];
      state.orgSlug = (decoded.orgSlug as string) || null;

      localStorage.setItem('token', action.payload.token);
      // Deliberately NOT cleared on logout (see below) — this is what lets ProtectedRoute
      // send a signed-out user back to the org-specific login page they came from, instead
      // of the generic one, even though logout() clears the in-memory orgSlug above.
      if (decoded.orgSlug) {
        localStorage.setItem('lastOrgSlug', decoded.orgSlug as string);
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.permissions = [];
      state.orgSlug = null;
      localStorage.removeItem('token');
      localStorage.removeItem('tenantId');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectPermissions = (state: { auth: AuthState }) => state.auth.permissions;
export const selectOrgSlug = (state: { auth: AuthState }) => state.auth.orgSlug;

export default authSlice.reducer;
