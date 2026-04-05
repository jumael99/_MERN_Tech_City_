import React from "react";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
              <td>
                <FontAwesomeIcon
                  icon={faBangladeshiTakaSign}
                  className="mr-1"
                />
                {item.price}
              </td>
              <td>
                <FontAwesomeIcon
                  icon={faBangladeshiTakaSign}
                  className="mr-1"
                />
                {item.qty * item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end">
        <strong>Subtotal:</strong>{" "}
        <FontAwesomeIcon icon={faBangladeshiTakaSign} className="mr-1" />
        {order.itemsPrice}
        <br />
        <strong>Shipping:</strong>{" "}
        <FontAwesomeIcon icon={faBangladeshiTakaSign} className="mr-1" />
        {order.shippingPrice}
        <br />
        <strong>Tax:</strong>{" "}
        <FontAwesomeIcon icon={faBangladeshiTakaSign} className="mr-1" />
        {order.taxPrice}
        <br />
        <strong>Total:</strong>{" "}
        <FontAwesomeIcon icon={faBangladeshiTakaSign} className="mr-1" />
        {order.totalPrice}
      </div>
    </div>
  );
});

export default InvoicePrint;
