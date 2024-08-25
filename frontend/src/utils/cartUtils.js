const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate items price
  state.itemsPrice = Math.round(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );

  // Calculate shipping price (fixed to 80)
  state.shippingPrice = 80;

  // Calculate tax price (15% tax)
  state.taxPrice = Math.round((2 / 100) * state.itemsPrice);

  // Calculate total price
  state.totalPrice = Math.round(
    Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice),
  );

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
