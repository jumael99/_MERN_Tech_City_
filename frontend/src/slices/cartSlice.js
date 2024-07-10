import { createSlice } from '@reduxjs/toolkit';
<<<<<<< Updated upstream
import {updateCart} from "../utils/cartUtils";

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [] };

=======
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : { cartItems: [] };
>>>>>>> Stashed changes

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      // Ensure item has a qty property, default to 1 if not provided
      const itemToAdd = { ...item, qty: item.qty || 1 };

      console.log('Adding to cart:', itemToAdd);

      const existItem = state.cartItems.find((x) => x._id === itemToAdd._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
<<<<<<< Updated upstream
          x._id === existItem._id ? item : x
=======
            x._id === existItem._id ? { ...x, qty: x.qty + 1 } : x
>>>>>>> Stashed changes
        );
      } else {
        state.cartItems = [...state.cartItems, { ...item, qty: 1 }];
      }

      return updateCart(state);
<<<<<<< Updated upstream

    }
=======
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
>>>>>>> Stashed changes
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;