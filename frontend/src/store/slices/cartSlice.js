import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: {} },  // matches your cartItems structure: { itemId: { size: qty } }
  reducers: {
    setCartItems(state, action) {
      state.items = action.payload;
    },
    addToCart(state, action) {
      const { itemId, size } = action.payload;
      if (!state.items[itemId]) state.items[itemId] = {};
      state.items[itemId][size] = (state.items[itemId][size] || 0) + 1;
    },
    updateQuantity(state, action) {
      const { itemId, size, quantity } = action.payload;
      if (!state.items[itemId]) state.items[itemId] = {};
      state.items[itemId][size] = quantity;
    },
    clearCart(state) {
      state.items = {};
    },
  },
});

export const { setCartItems, addToCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;