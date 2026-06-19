import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  globalLoading: boolean;
  notification: { message: string; type: 'success' | 'error' } | null;
}

const initialState: UIState = {
  sidebarOpen: true,
  globalLoading: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' } | null>) => {
      state.notification = action.payload;
    },
  },
});

export const { toggleSidebar, setGlobalLoading, setNotification } = uiSlice.actions;
export default uiSlice.reducer;