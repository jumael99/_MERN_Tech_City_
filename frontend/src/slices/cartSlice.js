import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

// Load persisted cart but ensure UI state (isOpen) starts closed
const loaded = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "sslcommerz" };

const initialState = { ...loaded, isOpen: false };

const buildKey = (item = {}) => `${item._id || ""}__${item.variantKey || ""}`;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      const incomingKey = buildKey(item);
      const existItem = state.cartItems.find(
        (x) => buildKey(x) === incomingKey,
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          buildKey(x) === incomingKey ? item : x,
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state, item);
    },
    removeFromCart: (state, action) => {
      const payload = action.payload;
      // Support legacy calls with just _id, and new composite matching
      let shouldKeep;
      if (
        payload &&
        typeof payload === "object" &&
        (payload._id || payload.variantKey)
      ) {
        const targetKey = buildKey(payload);
        shouldKeep = (x) => buildKey(x) !== targetKey;
      } else if (typeof payload === "string") {
        // Accept either id or a composite string "id__variantKey"
        const [idPart, variantPart = ""] = payload.split("__");
        shouldKeep = (x) => buildKey(x) !== `${idPart}__${variantPart}` && x._id !== payload;
      } else {
        shouldKeep = (x) => true;
      }

      state.cartItems = state.cartItems.filter(shouldKeep);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
    resetCart: (state) => {
      return initialState; // Properly reset the state to initial
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
