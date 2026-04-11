import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IModalSlice {
  modalLoginOpen: boolean;
}

const initialState: IModalSlice = {
  modalLoginOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModalLogin: (state, action: PayloadAction<boolean>) => {
      state.modalLoginOpen = action.payload;
    },
  },
});

export const { openModalLogin } = modalSlice.actions;
export default modalSlice.reducer;
