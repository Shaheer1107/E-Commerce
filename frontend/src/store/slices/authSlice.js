import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') ?? '',
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
      }
    },
    logout(state) {
      state.token = '';
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;