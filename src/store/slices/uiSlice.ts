import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
}

const initialState: UIState = {
  sidebarOpen: false,
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  setSidebarCollapsed,
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state: { ui: UIState }) =>
  state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state: { ui: UIState }) =>
  state.ui.sidebarCollapsed;

export default uiSlice.reducer;
