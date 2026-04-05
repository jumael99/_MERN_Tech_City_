function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

// NOTE: the code below has been changed from the course code to fix an issue
// with type coercion of strings to numbers.
// Our addDecimals function expects a number and returns a string, so it is not
// correct to call it passing a string as the argument.

export function calcPrices(orderItems) {
  const itemsPrice = Math.round(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );

  const shippingPrice = 80; // This is already an integer.
  const taxPrice = Math.round((2 / 100) * itemsPrice);

  const totalPrice = Math.round(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}
