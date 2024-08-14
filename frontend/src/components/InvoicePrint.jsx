import React from "react";

const InvoicePrint = React.forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className="p-5">
      <h2 className="text-center mb-3">Invoice</h2>
      <div className="mb-3">
        <strong>Order ID:</strong> {order._id}
      </div>
      <div className="mb-3">
        <strong>Customer:</strong> {order.user.name}
      </div>
      <div className="mb-3">
        <strong>Date:</strong> {new Date(order.paidAt).toLocaleDateString()}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>${item.price}</td>
              <td>${item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end">
        <strong>Subtotal:</strong> ${order.itemsPrice}
        <br />
        <strong>Shipping:</strong> ${order.shippingPrice}
        <br />
        <strong>Tax:</strong> ${order.taxPrice}
        <br />
        <strong>Total:</strong> ${order.totalPrice}
      </div>
    </div>
  );
});

export default InvoicePrint;
