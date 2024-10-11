// store/contactSlice.js
import { createSlice } from '@reduxjs/toolkit';

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    name: '',
    email: '',
    phone: '',
  },
  reducers: {
    setContact: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
    },
  },
});

export const { setContact } = contactSlice.actions;
export default contactSlice.reducer;
