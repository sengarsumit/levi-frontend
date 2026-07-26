import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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

function parseJwt (token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch(e) {
    return null;
  }
}

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
      
      const decoded = parseJwt(action.payload.token);
      if (decoded) {
        state.permissions = decoded.permissions || [];
        state.orgSlug = decoded.orgSlug || null;
      }

      localStorage.setItem('token', action.payload.token);
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
