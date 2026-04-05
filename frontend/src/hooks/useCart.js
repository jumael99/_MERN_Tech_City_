import { useDispatch, useSelector } from "react-redux";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  clearCartItems as clearCartItemsAction,
  openCart as openCartAction,
  closeCart as closeCartAction,
} from "../slices/cartSlice";

// Normalizes input so callers can pass { quantity } or { qty }
const normalizeItem = (item = {}) => {
  const qty = item.qty ?? item.quantity ?? 1;
  return { ...item, qty };
};

export default function useCart() {
  const dispatch = useDispatch();
  const { cartItems, itemsPrice, isOpen } = useSelector((s) => s.cart);

  const cartCount = cartItems?.reduce((acc, it) => acc + (it.qty || 0), 0) || 0;
  const cartTotal = typeof itemsPrice === "number"
    ? itemsPrice
    : cartItems?.reduce((acc, it) => acc + (it.price || 0) * (it.qty || 0), 0) || 0;

  const addToCart = (payload) => {
    const item = normalizeItem(payload);
    dispatch(addToCartAction(item));
  };

  const removeFromCart = (payload) => {
    // Prefer object with _id + variantKey to hit composite matcher
    if (typeof payload === "string") {
      dispatch(removeFromCartAction(payload));
    } else {
      const { _id, variantKey } = payload || {};
      dispatch(removeFromCartAction({ _id, variantKey }));
    }
  };

  const updateQuantity = (item, quantity) => {
    if (!item) return;
    const qty = Math.max(1, quantity | 0);
    addToCart({ ...item, qty });
  };

  const clearCart = () => dispatch(clearCartItemsAction());
  const openCart = () => dispatch(openCartAction());
  const closeCart = () => dispatch(closeCartAction());

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    isOpen,
  };
}

