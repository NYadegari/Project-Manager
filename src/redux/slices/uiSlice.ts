import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isSidebarCollapsed: boolean;
  activeModal: 'createProject' | 'inviteMember' | null;
}

const initialState: UIState = {
  isSidebarCollapsed: false,
  activeModal: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    openModal(state, action: PayloadAction<UIState['activeModal']>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    }
  }
});

export const { toggleSidebar, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;