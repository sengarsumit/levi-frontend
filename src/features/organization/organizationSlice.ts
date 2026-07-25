import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface OrganizationState {
  currentTenantId: string | null;
}

const initialState: OrganizationState = {
  currentTenantId: localStorage.getItem('tenantId'),
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setTenantId: (state, action: PayloadAction<string>) => {
      state.currentTenantId = action.payload;
      localStorage.setItem('tenantId', action.payload);
    },
    clearTenantId: (state) => {
      state.currentTenantId = null;
      localStorage.removeItem('tenantId');
    },
  },
});

export const { setTenantId, clearTenantId } = organizationSlice.actions;
export default organizationSlice.reducer;
